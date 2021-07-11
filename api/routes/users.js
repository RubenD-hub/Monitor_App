const express = require("express");         // --> Server
const router = express.Router();
const jwt = require("jsonwebtoken");        // --> Json web token
const bcrypt = require("bcrypt");           // --> Encrypt password
const { checkAuth } = require("../middlewares/authentication.js");

//models import
import User from "../models/user.js";
import EmqxAuthRule from "../models/emqx_auth.js";

//POST -> req.body
//GET -> req.query

// Authentication

// User register
router.post("/register", async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const encryptedPassword = bcrypt.hashSync(password, 10);    // Encrypt the password

        const newUser = {
        name: name,
        email: email,
        password: encryptedPassword
    };

    var user = await User.create(newUser);

    console.log(user);

    const toSend = {
      status: "success"
    };

    res.status(200).json(toSend);

    } catch (error) {

        console.log("ERROR - REGISTER ENDPOINT")
        console.log(error);

        const toSend = {
        status: "error",
        error: error
        };

        return res.status(500).json(toSend);

    }
});

// User login
router.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    var user = await User.findOne({email: email});      // Search for user in mongo

    //if no email
    if(!user){
        const toSend = {
            status: "error",
            error: "Invalid Credentials"
        }
        return res.status(401).json(toSend);    
    }

    //if email and password ok
    if (bcrypt.compareSync(password, user.password)){

        user.set('password', undefined, {strict: false});   // Remove the password field

        const token = jwt.sign({userData: user}, 'securePasswordHere', {expiresIn: 60 * 60 * 24 * 30});

        const toSend = {
            status: "success",
            token: token,
            userData: user
        }

        return res.json(toSend);

    }else{
        const toSend = {
            status: "error",
            error: "Invalid Credentials"
        }
        return res.status(401).json(toSend);
    }



});

//GET MQTT WEB CREDENTIALS
router.post("/getmqttcredentials", checkAuth,  async (req, res) => {

    try {
      const userId = req.userData._id;
  
      const credentials = await getWebUserMqttCredentials(userId);
  
      res.json(credentials);
  
    } catch (error) {
      console.log(error);
  
      const toSend = {
        status: "error"
      };
  
      return res.status(500).json(toSend);
    }
  });
  
  
  
  // mqtt credential types: "user", "device", "superuser"
  async function getWebUserMqttCredentials(userId){
  
    try {
      var rule = await EmqxAuthRule.find({ type: "user", userId: userId });
  
      if(rule.length == 0){
  
        const newRule = {
          userId: userId,
          username: makeid(10),
          password: makeid(10),
          publish: [userId + "/#"],
          subscribe: [userId + "/#"],
          type: "user",
          time: Date.now(),
          updatedTime: Date.now()
        }
  
      const result = await EmqxAuthRule.create(newRule);
  
      const toReturn = {
        username: result.username,
        password: result.password
      }
  
      return toReturn;
  
      }
  
      const newUserName = makeid(10);
      const newPassword = makeid(10);
  
      const result = await EmqxAuthRule.updateOne({type:"user", userId: userId}, {$set: {username: newUserName, password: newPassword, updatedTime: Date.now()}});
  
          // update response example
        //{ n: 1, nModified: 1, ok: 1 }
  
      if (result.n == 1 && result.ok == 1) {
          return {
              mqttUsername: newUsername,
              mqttPassword: newPassword
          }
      }else{
          return false;
      }
  
    } catch (error) {
      console.log(error);
      return false;
    }
  
  }
  
  
  function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

module.exports = router;