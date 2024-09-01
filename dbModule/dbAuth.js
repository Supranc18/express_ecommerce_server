const mongoose = require("mongoose");



const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userschema = new Schema({
  name: String,
  email: String,
  password: String,
  role: String
  
});

const User = mongoose.model('user', userschema);

module.exports=User