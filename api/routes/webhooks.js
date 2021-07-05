// ****************************************
// ********       Librerias        ********
// ****************************************
const express = require('express');
const router = express.Router();
const axios = require('axios');
const colors = require('colors');


// ****************************************
// ********       h        ********
// ****************************************
router.post('/saver-webhook', async (req, res) => {

    const data = req.body;
    //const a = data.topic.split('/');
    console.log(data);
    res.json("{}");

});

module.exports = router; 