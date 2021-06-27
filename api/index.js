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
