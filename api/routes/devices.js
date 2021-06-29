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
router.get("/device", checkAuth ,(req, res) => {

    
});

// Create device
router.post("/device", (req, res) => {

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