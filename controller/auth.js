const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require("../dbModule/dbauth");


async function signup(req, res) {
   
    try {
        // ***error validation using joi**
        const signupValidationSchema = Joi.object({
            name: Joi.string().required(),
            password: Joi.string().required().min(8),
            email: Joi.string().required().email(),
            role: Joi.string().required().valid("seller","buyer"),

           
        })

        let validationStatus = signupValidationSchema.validate(req.body, {
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


        // ***checking if user already exist**
       let emailAlreadyExist= await User.findOne({email:req.body.email})
       if (emailAlreadyExist) {
        return res.status(400).send({
            msg: "Bad request",
            errors: [
                {
                    message: "email aready used",
                    field: "email",
                },
            ],
        })
        
       }
        
    //    ***password hashing  using bcrypt
        let hashedPassword = await bcrypt.hash(req.body.password, 10);

       let user = await User.create({
            name:req.body.name,
            email:req.body.email,
            password:hashedPassword,
            role:req.body.role
        })
        res.send(user)
        
    } catch (error) {
        res.status(500).send("server error")
        
    }
    
  }
  async function login(req, res) {
    try {

       let user = await User.findOne({email:req.body.email}) 
       if (user) {
        user=user.toObject() //converting mongoose object in to normal js object
        let passwordMatch = await bcrypt.compare(req.body.password, user.password);
        
        if (passwordMatch) {
            delete user.password
            let token = jwt.sign(user, 'supranc');
            res.send({
                ...user,token
            })
            return
        }
       }
        res.status(401).send({
            msg:"Invalid creadiatiol"
        })
      
        
    } catch (error) {
        
    }
    
  }


  async function forgetPassword(req, res) {
    try {
        let user =await User.findOne({email:req.body.email})
        if (user){
        let passwordMatch = await bcrypt.compare(req.body.currentPassword, user.password);
        if (passwordMatch) {
            
            if (req.body.newPassword === req.body.currentPassword) { 
                return res.status(400).send({
                msg: "New password cannot be the same as the current password"
            });
        }

            let hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
           await User.updateOne(                    
            { email: req.body.email },
             {password:hashedPassword}
            )
  
            return res.send({ msg: "Password updated successfully" });
        } else {
            return res.status(401).send({
                msg: "Incorrect current password"
            });
        }
    } else {
        return res.status(404).send({
            msg: "User not found"
        });
    }
} catch (error) {
    console.error(error);
    return res.status(500).send({
        msg: "Server error"
    });
}
  }
  
 module.exports={
    signup:signup,
    login:login,
    forgetPassword,
}