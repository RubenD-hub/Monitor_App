const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {

    //console.log(req.query.dId);
  
    var toReturn = {
      status: "success",
      data: "HELLO FROM GET"
    }
  
    res.json(toReturn);
  
  });
  
  
  router.post("/test", (req, res) => {
  
    console.log(req.body);
  
    var toReturn = {
      status: "success",
      data: "HELLO FRON POST"  
    }
  
    res.json(toReturn);
  
  });






// Get all devices
router.get("/device", (req, res) => {

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

module.exports = router;