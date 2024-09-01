const express = require('express')
const cors = require('cors')
require("./dbConfig/database")
const app = express()
const authRoute = require('./route/authRout')
const productRoute =require('./route/productRout')
const acessoriesRoute =require('./route/acessoriesRout')
const blogRoute =require('./route/blogRout')
const fileUpload = require('express-fileupload')




app.use(cors())
// globle middleware
app.use(express.json())// express.json = () => (req,res,next) =>{ req.body = postman body  }
app.use('/images', express.static('images'))
app.use(fileUpload())


app.use("/api",authRoute)
app.use("/api/product",productRoute)
app.use("/api/acessories",acessoriesRoute)
app.use("/api/blog",blogRoute)


app.listen(8000,()=>{
    console.log("server started");
})