const mongoose = require('mongoose');

const User = new mongoose.model('User',{
  name: String,
  password: String,
  email: String
})

module.exports = User