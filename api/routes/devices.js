const express = require("express");
const router = express.Router();

const { checkAuth } = require('../middlewares/authentication.js')


// Get all devices
router.get("/device", checkAuth ,(req, res) => {

    console.log(req.userData); 

    //req.userData.userId

    const toSend = {
        status: "success",
        data: "[2 , 3 , 4 , 5 ]"
    };

    return res.status(200).json(toSend);
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