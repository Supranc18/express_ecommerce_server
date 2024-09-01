const express = require('express')
const {add, edit, remove, product, product_id } = require('../controller/acessories')
const {checkAuthentication,forSeller} = require('../middleware/tokenMiddleware')


const router =express.Router()
router.get('',product)
router.post('',checkAuthentication,forSeller, add )
router.put('/:id',checkAuthentication,forSeller,edit )
router.delete('/:id',checkAuthentication,forSeller,remove )
router.get('/:id',checkAuthentication,forSeller,product_id )

module.exports=router