const express = require('express')
const {add, edit, remove, blog, blog_id } = require('../controller/blog')
const {checkAuthentication,forSeller} = require('../middleware/tokenMiddleware')


const router =express.Router()
router.get('',blog)
router.post('',checkAuthentication,forSeller, add )
router.put('/:id',checkAuthentication,forSeller,edit )
router.delete('/:id',checkAuthentication,forSeller,remove )
router.get('/:id',checkAuthentication,forSeller,blog_id )

module.exports=router