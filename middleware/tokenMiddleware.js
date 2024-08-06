const jwt = require("jsonwebtoken");

function checkAuthentication (req, res, next) {
    try {
        let token= req.headers.authorization.replace("Bearer ","")
        let decoded = jwt.verify(token, 'supranc');  
        req.user=decoded
        next()
      }       
   catch (error) {
    return res.status(400).send({
        msg:"unauthorize access"
    })   
    }
} 

function forSeller(req,res,next){
    if (req.user.role == "seller") {
        next()
    }
    else{
        res.status(403).send({
            msg:"access denined: only for seller"
        })
    }
}

function forbuyer(req,res,next){
    if (req.user.role == "seller") {
        next()
    }
    else{
        res.status(403).send({
            msg:"access denined: only for buyer"
        })
    }
}
   
  module.exports= {
    checkAuthentication,
    forSeller  
}
  
  