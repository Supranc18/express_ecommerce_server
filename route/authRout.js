const express = require('express')
const { signup, login, forgetPassword } = require('../controller/auth')
const router =express.Router()

router.post('/signup',signup )
router.post('/login',login )
router.put('/forgetpassword/',forgetPassword)

module.exports=router