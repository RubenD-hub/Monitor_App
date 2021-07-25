// ****************************************
// ********       Librerias        ********
// ****************************************
const express = require("express");
const router = express.Router();
const axios = require("axios");
const colors = require("colors");
const { checkAuth } = require("../middlewares/authentication.js");
var mqtt = require("mqtt");

/*
============================================
                  MODELS                                    
============================================
*/

import Data from "../models/data.js";
import Device from "../models/device.js";
import EmqxAuthRule from "../models/emqx_auth.js";
import Notification from "../models/notifications.js";
import AlarmRule from "../models/emqx_alarm_rule.js";
import Template from "../models/template.js";

var client;

/*
============================================
                  API                                    
============================================
*/

var ex = {
  username: "superuser",
  password: "superuser",
  topic: "5ffcc00149fdcf311a4de607/22222/",
  variables: [
    {
      variable: "6hRtQGSFIl",
      variableFullName: "Temperature",
      variableType: "input",
      variableSendFreq: 10
    },
    {
      variable: "byTmALXl2Y",
      variableFullName: "Humidity",
      variableType: "input",
      variableSendFreq: 5
    },
    {
      variable: "PMHPI0zBNQ",
      variableFullName: "Pump",
      variableType: "output",
      variableSendFreq: undefined
    },
    {
      variable: "yvFApiNOqz",
      variableFullName: "Fan",
      variableType: "output",
      variableSendFreq: undefined
    }
  ]
};

//DEVICE CREDENTIALS WEBHOOK
router.post("/getdevicecredentials", async (req, res) => {
  try {
    const dId = req.body.dId;

    const password = req.body.password;

    const device = await Device.findOne({ dId: dId });

    if (password != device.password) {
      return res.status(401).json();
    }

    const userId = device.userId;

    var credentials = await getDeviceMqttCredentials(dId, userId);

    var template = await Template.findOne({ _id: device.templateId });

    console.log(template);

    var variables = [];

    template.widgets.forEach(widget => {
      var v = (({ variable, varFullName, variableType, variableSendFreq }) => ({
        variable,
        varFullName,
        variableType,
        variableSendFreq
      }))(widget);

      variables.push(v);
    });

    const response = {
      username: credentials.username,
      password: credentials.password,
      topic: userId + "/" + dId + "/",
      variables: variables
    };
    res.json(response);

    setTimeout(() => {
      getDeviceMqttCredentials(dId, userId);
      console.log("Device Credentials Updated");
    }, 30000);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// ****************************************
// ********     SAVER WEBHOOK      ********
// ****************************************
router.post("/saver-webhook", async (req, res) => {
  try {
    if (req.headers.token != "121212") {
      req.sendStatus(404);
      return;
    }

    const data = req.body;

    const splittedTopic = data.topic.split("/");
    const dId = splittedTopic[1];
    const variable = splittedTopic[2];

    var result = await Device.find({ dId: dId, userId: data.userId });

    if (result.length == 1) {
      Data.create({
        userId: data.userId,
        dId: dId,
        variable: variable,
        value: data.payload.value,
        time: Date.now()
      });
      console.log("Data created");
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(200);
  }
});

//ALARMS WEBHOOK
router.post("/alarm-webhook", async (req, res) => {
  try {
    if (req.headers.token != "121212") {
      res.sendStatus(404);
      return;
    }

    res.sendStatus(200);

    const incomingAlarm = req.body;

    updateAlarmCounter(incomingAlarm.emqxRuleId);

    const lastNotif = await Notification.find({
      dId: incomingAlarm.dId,
      emqxRuleId: incomingAlarm.emqxRuleId
    })
      .sort({ time: -1 })
      .limit(1);

    if (lastNotif == 0) {
      console.log("FIRST TIME ALARM");
      saveNotifToMongo(incomingAlarm);
      sendMqttNotif(incomingAlarm);
    } else {
      const lastNotifToNowMins = (Date.now() - lastNotif[0].time) / 1000 / 60;

      if (lastNotifToNowMins > incomingAlarm.triggerTime) {
        console.log("TRIGGERED");
        saveNotifToMongo(incomingAlarm);
        sendMqttNotif(incomingAlarm);
      }
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(200);
  }
});

//GET NOTIFICATIONS
router.get("/notifications", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;
    const notifications = await getNotifications(userId);

    const response = {
      status: "success",
      data: notifications
    };
    res.json(response);
  } catch (error) {
    console.log("ERROR GETTING NOTIFICATIONS");
    console.log(error);

    const response = {
      status: "error",
      error: error
    };

    return res.status(500).json(response);
  }
});

//UPDATE NOTIFICATION (readed status)
router.put("/notifications", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;

    const notificationId = req.body.notifId;

    await Notification.updateOne(
      { userId: userId, _id: notificationId },
      { readed: true }
    );

    const response = {
      status: "success"
    };
    res.json(response);
  } catch (error) {
    console.log("ERROR UPDATING NOTIFICATION STATUS");
    console.log(error);

    const response = {
      status: "error",
      error: error
    };

    return res.status(500).json(response);
  }
});

/*
============================================
                Functions                                    
============================================
*/

async function getDeviceMqttCredentials(dId, userId) {
  try {
    var rule = await EmqxAuthRule.find({
      type: "device",
      userId: userId,
      dId: dId
    });

    if (rule.length == 0) {
      const newRule = {
        userId: userId,
        dId: dId,
        username: makeid(10),
        password: makeid(10),
        publish: [userId + "/" + dId + "/+/sdata"],
        subscribe: [userId + "/" + dId + "/+/actdata"],
        type: "device",
        time: Date.now(),
        updatedTime: Date.now()
      };

      const result = await EmqxAuthRule.create(newRule);

      const toReturn = {
        username: result.username,
        password: result.password
      };

      return toReturn;
    }

    const newUserName = makeid(10);
    const newPassword = makeid(10);

    const result = await EmqxAuthRule.updateOne(
      { type: "device", dId: dId },
      {
        $set: {
          username: newUserName,
          password: newPassword,
          updatedTime: Date.now()
        }
      }
    );

    // update response example
    //{ n: 1, nModified: 1, ok: 1 }

    if (result.n == 1 && result.ok == 1) {
      return {
        username: newUserName,
        password: newPassword
      };
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

function startMqttClient() {
  const options = {
    port: 1883,
    host: "localhost",
    clientId:
      "webhook_superuser" + Math.round(Math.random() * (0 - 10000) * -1),
    username: "superuser",
    password: "superuser",
    keepalive: 60,
    reconnectPeriod: 5000,
    protocolId: "MQIsdp",
    protocolVersion: 3,
    clean: true,
    encoding: "utf8"
  };

  client = mqtt.connect("mqtt://" + "localhost", options);

  client.on("connect", function() {
    console.log("MQTT CONNECTION -> SUCCESS;".green);
    console.log("\n");
  });

  client.on("reconnect", error => {
    console.log("RECONNECTING MQTT");
    console.log(error);
  });

  client.on("error", error => {
    console.log("MQTT CONNECIONT FAIL -> ");
    console.log(error);
  });
}

function sendMqttNotif(notif) {
  const topic = notif.userId + "/dummy-did/dummy-var/notif";
  const msg =
    "The rule: when the " +
    notif.varFullName +
    " is " +
    notif.condition +
    " than " +
    notif.value;
  client.publish(topic, msg);
}

//GET ALL NOT READED NOTIFICATIONS
async function getNotifications(userId) {
  try {
    const res = await Notification.find({ userId: userId, readed: false });
    return res;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function saveNotifToMongo(incomingAlarm) {
  try {
    var newNotif = incomingAlarm;
    newNotif.time = Date.now();
    newNotif.readed = false;
    Notification.create(newNotif);
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function updateAlarmCounter(emqxRuleId) {
  try {
    await AlarmRule.updateOne(
      { emqxRuleId: emqxRuleId },
      { $inc: { counter: 1 } }
    );
  } catch (error) {
    console.log(error);
    return false;
  }
}

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

setTimeout(() => {
  startMqttClient();
}, 3000);

module.exports = router;
