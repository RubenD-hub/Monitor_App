const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middlewares/authentication.js");
const axios = require("axios");

/*
============================================
                  MODELS                                    
============================================
*/

import Device from "../models/device.js";
import SaverRule from '../models/emqx_saver_rule.js';

/*
============================================
                  API                                    
============================================
*/

const auth = {
  auth: {
    username: "admin",
    password: "public"
  }
};

//GET DEVICES
router.get("/device", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;
    const devices = await Device.find({ userId: userId });

    const toSend = {
      status: "success",
      data: devices
    };

    res.json(toSend);
  } catch (error) {
    console.log("ERROR GETTING DEVICES");

    const toSend = {
      status: "error",
      error: error
    };

    return res.status(500).json(toSend);
  }
});

//NEW DEVICE
router.post("/device", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;
    var newDevice = req.body.newDevice;

    newDevice.userId = userId;
    newDevice.createdTime = Date.now();

    const device = await Device.create(newDevice);

    selectDevice(userId, newDevice.dId);

    const toSend = {
      status: "success"
    };

    return res.json(toSend);
  } catch (error) {
    console.log("ERROR CREATING NEW DEVICE");
    console.log(error);

    const toSend = {
      status: "error",
      error: error
    };

    return res.status(500).json(toSend);
  }
});

//DELETE DEVICE
router.delete("/device", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;
    const dId = req.query.dId;

    const result = await Device.deleteOne({ userId: userId, dId: dId });

    const toSend = {
      status: "success",
      data: result
    };

    return res.json(toSend);
  } catch (error) {
    console.log("ERROR DELETING DEVICE");
    console.log(error);

    const toSend = {
      status: "error",
      error: error
    };

    return res.status(500).json(toSend);
  }
});

//UPDATE DEVICE
router.put("/device", checkAuth, (req, res) => {
  const dId = req.body.dId;
  const userId = req.userData._id;

  if (selectDevice(userId, dId)) {
    const toSend = {
      status: "success"
    };

    return res.json(toSend);
  } else {
    const toSend = {
      status: "error"
    };

    return res.json(toSend);
  }
});

/*
============================================
                Functions                                    
============================================
*/

setTimeout(() => {
  createSaverRule("121212","11111",false);
}, 2000);

async function selectDevice(userId, dId) {
  try {
    const result = await Device.updateMany(
      { userId: userId },
      { selected: false }
    );

    const result2 = await Device.updateOne(
      { dId: dId, userId: userId },
      { selected: true }
    );

    return true;

  } catch (error) {
    console.log("ERROR IN 'selectDevice' FUNCTION ");
    console.log(error);
    return false;
  }
}

/*
 SAVER RULES FUNCTIONS
*/
//get saver rule

async function createSaverRule(userId, dId, status) {

  try {
    const url = "http://localhost:8085/api/v4/rules";

  const topic = userId + "/" + dId + "/+/sdata";

  const rawsql = "SELECT topic, payload FROM \"" + topic + "\" WHERE payload.save = 1";

  var newRule = {
    rawsql: rawsql,
    actions: [
      {
        name: "data_to_webserver",
        params: {
          $resource: global.saverResource.id,
          payload_tmpl: '{"userId":"' +  userId + '","payload":${payload},"topic":"${topic}"}'
        }
      }
    ],
    description: "SAVER-RULE",
    enabled: status
  };

  //save rule in emqx - grabamos la regla en emqx
  const res = await axios.post(url, newRule, auth);

  if(res.status === 200 && res.data.data){
    console.log(res.data.data);

    // Save rule in mongo
    await SaverRule.create({
      userId: userId,
      dId: dId,
      emqxRuleId: res.data.data.id,
      status: status
    });

    return true;

  }else{
    return false;
  }

  } catch (error) {
    console.log("Error creating saver rule")
    console.log(error);
    return false;
  }

  

}

module.exports = router;