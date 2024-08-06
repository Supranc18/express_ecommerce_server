const Joi = require("joi")
const Product = require("../dbModule/dbProduct")
const path = require("path")




async function add(req, res) {
    try {
      const productValidationSchema = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        in_stock: Joi.number().required(),
        description:Joi.string().required(),
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
      image=`/image/${imageName}-${Date.now()}.${imageType}`
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
      let search= req.query.search ||""
      let sort
      let price
    
      if(req.query.sort){
        if(req.query.sort ==="dateDec"){
          sort={createdAt:-1}
        }
      
      }
      let product = await Product.find({name:RegExp(search,"i")
      })
      .sort(sort)
      
      res.send(product)
      
        
    } catch (error) {
      res.status(500).send("server error")     
    }
    
  }

  async function edit(req, res) {
    try {
      let userId=(req.body.user);
      if(req.user._id==userId){
      let product = await Product.findByIdAndUpdate(req.params.id,{
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
      })
    }   
    } catch (error) {
      res.status(500).send("server error")     
    }
    
  }

  async function remove(req, res) {
    try {
      let userId=(req.body.user);
      if(req.user._id==userId){
      let product = await Product.findByIdAndDelete( req.params.id,{ 
      })
      res.send("product deleted") 
    } 
    else{
      res.status(403).send({
        msg:"invalied user",
      })
    }   
    } catch (error) {
      res.status(500).send("server error")     
    }
    
  }
  
 module.exports={
    add,
    product,
    edit,
    remove
}