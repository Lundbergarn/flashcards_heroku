const mongoose = require('mongoose');
const url = require('../config/config');

mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true
    // Sets up a correct index for our data  
})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err))
