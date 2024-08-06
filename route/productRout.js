const express = require('express')
const {add, edit, remove, product } = require('../controller/product')
const {checkAuthentication,forSeller} = require('../middleware/tokenMiddleware')


const router =express.Router()
router.get('',product)
router.post('/add',checkAuthentication,forSeller, add )
router.put('/edit/:id',checkAuthentication,forSeller,edit )
router.delete('/remove/:id',checkAuthentication,forSeller,remove )

module.exports=router