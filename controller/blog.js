const Joi = require("joi")
const Blog = require("../dbModule/dbBlog")
const path = require("path")
const { isValidObjectId } = require('mongoose');




async function add(req, res) {
    try {
      const productValidationSchema = Joi.object({
        explain: Joi.string().required(),
        topic: Joi.string().required(),
      })
      let validationStatus = productValidationSchema.validate(req.body, {
        allowUnknown: true,
        abortEarly: false,
    })
    if (validationStatus.error) {
      let errors = validationStatus.error.details.map((el) => {
          return {
              message: el.message,
              field: el.context.key,
          }
      })
      return res.status(400).send({
        msg: "Bad request",
        errors,
    })
    }
    let fileUpload = req.files?.image
  
    if (fileUpload) {
      let fileName =fileUpload.name
      let split =fileName.split(".")
      let imageName=split[0]
      let imageType=split[1]
      let imageStorePath =(path.resolve("./images",`${imageName}-${Date.now()}.${imageType}`));
      image=`/images/${imageName}-${Date.now()}.${imageType}`
      
req.files.image.mv(imageStorePath),(err)=>{
  res.status(400).send({
    msg:"error uploading image"
  })
}
    }
 
      let blog =await Blog.create({
        ...req.body,
        user:req.user._id,
        image:image,
      })
        res.send(blog)
    } catch (error) {
        res.status(500).send("server error");  
    }
    
  }

  async function blog(req, res) {
    try {
      let search = req.query.search || "";
      let sort;
  
      if (req.query.sort) {
        if (req.query.sort === "dateDec") {
          sort = { createdAt: -1 };
        }
      }
  
      // Pagination variables
      const page = parseInt(req.query.page) || 1; // Current page number
      const limit = 6; // Number of products per page
      const skip = (page - 1) * limit; // Number of products to skip
  
      let blog = await Blog.find({
        topic: new RegExp(search, "i")
      })
        .sort(sort)
        .skip(skip) // Skip the previous pages of products
        .limit(limit); // Limit to 8 products
  
      res.send(blog);
    } catch (error) {
      res.status(500).send("server error");
    }
  }
  

  async function edit(req, res) {
    try {
      let blogId = req.params.id.trim();
    
      
      if(req.user._id){
        if (!isValidObjectId(blogId)) {
          return res.status(400).send({ msg: "Invalid product ID format" });
        }
      const blog = await Blog.findByIdAndUpdate(blogId,{
        topic:req.body.topic,
        explain:req.body.explain,
        
      })
      res.send(blog)
    }
    else{
      res.status(403).send({
        msg:"invalied user",
        err:userId,
        err2:req.user._id
      })
    }   
    } catch (error) {
      res.status(500).send("server error")     
    }
    
  }

  async function remove(req, res) {
    try {
      let blogId = req.params.id.trim(); // Trim whitespace and newlines
      
  
      if (req.user._id) {
        // Validate the product ID format
        if (!isValidObjectId(blogId)) {
          return res.status(400).send({ msg: "Invalid product ID format" });
        }
  
        const blog = await Blog.findByIdAndDelete(blogId);
        if (!blog) {
          return res.status(404).send({ msg: "Blog not found" });
        }
        res.send("Blog deleted");
      } else {
        res.status(403).send({ msg: "Invalid user",
          err2:req.user._id
         });
      }
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).send("server error");
    }
  }

  async function blog_id(req, res) {
    try {
      let blogId = req.params.id.trim();
    
      let blog = await Blog.findById(blogId,{
      })
      res.send(blog) 
    } catch (error) {
      res.status(500).send("server error")     
    }
    
  }

  
 module.exports={
    add,
    blog,
    edit,
    remove,
    blog_id
}