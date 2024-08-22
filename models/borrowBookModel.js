const mongoose = require('mongoose')
const borrowingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    book: {
        type: mongoose.Schema.ObjectId,
        ref: "Book",
        required: true,
    },
    bookReturned: {
        type: Boolean,
        required: false,
        default: false,
    },

})

const  Borrowedbook = mongoose.model('Borrowedbook', borrowingSchema)

module.exports = Borrowedbook