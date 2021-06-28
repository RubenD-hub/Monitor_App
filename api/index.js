// Libreries

const express = require('express');     // --> Server
const mongoose = require("mongoose");   // --> Mongo conection
const morgan = require("morgan");       // --> Show request
const cors = require("cors");           // --> Access policies
const colors = require("colors");       // --> Answer color (console)


// Instances
const app = express();

//express config
app.use(morgan("tiny"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(cors());

//express routes
app.use("/api1", require("./routes/devices.js"));

module.exports = app;

// Listener
app.listen(3001, () => {
    console.log("Api server listening on port 3001");
});






//Mongo Connection
const mongoUserName = "devuser";
const mongoPassword = "devpassword";
const mongoHost = "localhost";
const mongoPort = "27017";
const mongoDatabase = "Monitor";

var uri =
  "mongodb://" +
  mongoUserName +
  ":" +
  mongoPassword +
  "@" +
  mongoHost +
  ":" +
  mongoPort +
  "/" +
  mongoDatabase;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  authSource: "admin"
};

try {
    mongoose.connect(uri, options).then(
        () => {
          console.log("\n");
          console.log("*******************************".green);
          console.log("✔ Mongo Successfully Connected!".green);
          console.log("*******************************".green);
          console.log("\n");
        },
        (err) => {
          console.log("\n");
          console.log("*******************************".red);
          console.log("    Mongo Connection Failed    ".red);
          console.log("*******************************".red);
          console.log("\n");
          console.log(err);
        }
      );
} catch (error) {
    console.log("ERROR CONNECTING MONGO ");
    console.log(error);
}