
const mongoose = require("mongoose");



const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const blogschema = new Schema({
 
  
  topic:String,
  explain:String,
  user:{
    type:ObjectId,
    ref:"User"
  },
  image:String,  
    
},
{
  timestamps:true,
});

const Blog = mongoose.model('blog', blogschema);

module.exports=Blog