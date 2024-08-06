const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-server')
  .then(() => console.log('Connected!'));