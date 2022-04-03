const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    id: Number,
    username: String,
    password: String,
    userDetails: Array,
    fuelQuotes: Array
})

const users = mongoose.model('User', userSchema)

module.exports = users