
const mongoose = require("mongoose");



const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const accesssorieschema = new Schema({
  name: String,
  price: Number,
  in_stock: Number,
  description:String,
  user:{
    type:ObjectId,
    ref:"User"
  },
  image:String,  
    
},
{
  timestamps:true,
});

const Accessories = mongoose.model('accessories', accesssorieschema);

module.exports=Accessories