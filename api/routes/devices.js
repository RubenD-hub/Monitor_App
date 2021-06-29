const express = require("express");
const router = express.Router();

const { checkAuth } = require('../middlewares/authentication.js')


/*  
  __  __         _     _    
 |  \/  |___  __| |___| |___
 | |\/| / _ \/ _` / -_) (_-<
 |_|  |_\___/\__,_\___|_/__/
                            
*/

import Device from '../models/device.js';

/*  _        _ 
   /_\  _ __(_)
  / _ \| '_ \ |
 /_/ \_\ .__/_|
       |_|     
*/

// Get all devices
router.get("/device", checkAuth , async (req, res) => {

    try {

        const userId = req.userData._id;
        const devices = await Device.find({ userId: userId });
    
        const toSend = {
          status: "success",
          data: devices
        };
    
        res.json(toSend);
    
    } catch (error) {
    
        console.log("ERROR GETTING DEVICES")
    
        const toSend = {
          status: "error",
          error: error
        };
    
        return res.status(500).json(toSend);
    }
});

// Create new device
router.post("/device", checkAuth , async (req, res) => {

    try {
        const userId = req.userData._id;
        var newDevice = req.body.newDevice;
        
        newDevice.userId = userId;
        newDevice.createdTime = Date.now();
      
        const device = await Device.create(newDevice);
      
        const toSend = {
          status: "success"
        }
      
        return res.json(toSend);
    
    } catch (error) {
        console.log("ERROR CREATING NEW DEVICE");
        console.log(error);
    
        const toSend = {
          status: "error",
          error: error
        }
      
        return res.status(500).json(toSend);
    
    }

});

// Delete device
router.delete("/device", (req, res) => {

});

// Update device
router.put("/device", (req, res) => {

});

/*
___             _   _             
| __|  _ _ _  __| |_(_)___ _ _  ___
| _| || | ' \/ _|  _| / _ \ ' \(_-<
|_| \_,_|_||_\__|\__|_\___/_||_/__/
                                        
*/


module.exports = router;