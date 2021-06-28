import mongoose from "mongoose";        // --> Mongo conection
const uniqueValidator = require("mongoose-unique-validator");   // --> Unique values

const Schema = mongoose.Schema;
 // Schema structure collection of mongo
const userSchema = new Schema({
  name: { type: String, required: [true] },
  email: { type: String, required: [true], unique: true},
  password: {  type: String, required: [true]},
});


//Validator
userSchema.plugin(uniqueValidator, { message: 'Error, email already exists.'});


// convert to model
const User = mongoose.model('User', userSchema);

export default User;