const Book = require("../models/bookModel");
const User = require("../models/userAuthModel");

const addbook = async (req, res) => {
    const { title, author, ISBN, publicationDate, genre, numberOfCopies } = req.body;

    try {
        const user = await User.findById(req.user._id); 
        console.log(user, 'user form addbook fun');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Only admins can add books." });
        }

        const book = new Book({
            title,
            author,
            ISBN,
            publicationDate,
            genre,
            numberOfCopies,
            user: user._id
        });

        const savedBook = await book.save();
        res.status(200).json({
            message: "Book added successfully",
            savedBook,
        });

    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const updatebook = async (req, res) => {

    const { title, author, ISBN, publicationDate, genre, numberOfCopies } = req.body

    const { bookid } = req.params

    try {
        const user = await User.findById(req.user._id);
        console.log(user, 'user form addbook fun');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Only admins can add books." });
        }

        const book = await Book.findByIdAndUpdate(
            {
                _id: bookid,
                user: req.user._id
            },
            {
                title, author, ISBN, publicationDate, genre, numberOfCopies,
                user: req.user._id
            },

            { new: true }
        )

        res.status(200).json({
            message: 'Books updated sucsessfull',
            book
        })

    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const deletebook = async (req, res) => {

    try {
        const { bookid } = req.params

        if (!bookid) {
            return res.status(404).json({
                message: 'Book Id not found'
            })
        }

        const user = await User.findById(req.user._id);
        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Only admins can add books." });
        }

        const deletedBook = await Book.findByIdAndDelete(
            {
                _id: bookid,
                user: req.user._id
            }
        )

        res.status(200).json({
            message: 'Book deleted successfully',
            deletedBook,
        })

    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ error: "Internal server error" });
    }
}



const listBooks = async (req, res) => {
    try {


        const { page = 1, limit = 10, genre, author } = req.query;

        const filter = {};
        if (genre) filter.genre = genre;
        if (author) filter.author = author;




        const books = await Book.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)

        const count = await Book.countDocuments(filter);

        res.status(200).json({
            books,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "Something went wrong",
            errorMessage: error.message,
        });
    }
};



module.exports = {
    addbook,
    updatebook,
    deletebook,
    listBooks
};
