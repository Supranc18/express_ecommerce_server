const express = require('express')
const { signup, login, forgetPassword, user } = require('../controller/auth')
const { checkAuthentication } = require('../middleware/tokenMiddleware')
const router =express.Router()

router.post('/signup',signup )
router.post('/login',login )
router.put('/forgetpassword/',forgetPassword)
router.get('/get-user/',checkAuthentication,user)

module.exports=router