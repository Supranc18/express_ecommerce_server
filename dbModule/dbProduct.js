
const mongoose = require("mongoose");



const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productschema = new Schema({
  name: String,
  bread:String,
  price: Number,
  gender:String,
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

const Product = mongoose.model('product', productschema);

module.exports=Product