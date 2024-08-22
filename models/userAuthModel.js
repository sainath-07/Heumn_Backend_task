const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter the name']
    },
    email: {
        type: String,
        required: [true, 'Please enter the email']
    },
    password: {
        type: String,
        required: [true, 'Please enter the password']
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'],
    }
})

const User=mongoose.model('User',userSchema)
module.exports=User;