const Joi = require("joi")
const Product = require("../dbModule/dbProduct")
const path = require("path")
const { isValidObjectId } = require('mongoose');




async function add(req, res) {
    try {
      const productValidationSchema = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        in_stock: Joi.number().required(),
        description:Joi.string().required(),
        gender: Joi.string().required().valid("male","female"),
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
 
      let product =await Product.create({
        ...req.body,
        user:req.user._id,
        image:image,
      })
        res.send(product)
    } catch (error) {
        
    }
    
  }

  async function product(req, res) {
    try {
      let search = req.query.search || "";
      let sort;
      let price;
  
      if (req.query.sort) {
        if (req.query.sort === "dateDec") {
          sort = { createdAt: -1 };
        }
      }
  
      // Pagination variables
      const page = parseInt(req.query.page) || 1; // Current page number
      const limit = 6; // Number of products per page
      const skip = (page - 1) * limit; // Number of products to skip
  
      let product = await Product.find({
        name: new RegExp(search, "i")
      })
        .sort(sort)
        .skip(skip) // Skip the previous pages of products
        .limit(limit); // Limit to 8 products
  
      res.send(product);
    } catch (error) {
      res.status(500).send("server error");
    }
  }
  

  async function edit(req, res) {
    try {
      let productId = req.params.id.trim();
    
      
      if(req.user._id){
        if (!isValidObjectId(productId)) {
          return res.status(400).send({ msg: "Invalid product ID format" });
        }
      const product = await Product.findByIdAndUpdate(productId,{
        name:req.body.name,
        price:req.body.price,
        in_stock:req.body.in_stock,
        description:req.body.description,
      })
      res.send(product)
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
      let productId = req.params.id.trim(); // Trim whitespace and newlines
      
  
      if (req.user._id) {
        // Validate the product ID format
        if (!isValidObjectId(productId)) {
          return res.status(400).send({ msg: "Invalid product ID format" });
        }
  
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
          return res.status(404).send({ msg: "Product not found" });
        }
        res.send("Product deleted");
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

  async function product_id(req, res) {
    try {
      let productId = req.params.id.trim();
    
      let product = await Product.findById(productId,{
      })
      res.send(product) 
    } catch (error) {
      res.status(500).send("server error")     
    }
    
  }

  
 module.exports={
    add,
    product,
    edit,
    remove,
    product_id
}