const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    author: {
        type: String,
        required: true,
    },
    ISBN: {
        type: String,
        required: true,
        unique: true,
    },
    publicationDate: {
        type: Date,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    numberOfCopies: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;