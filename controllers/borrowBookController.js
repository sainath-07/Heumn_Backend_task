const Book = require('../models/bookModel');
const Borrowedbook = require('../models/borrowBookModel');
const BorrowedBook = require('../models/borrowBookModel');

// Borrow Book Function
const borrowBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user._id;

        const book = await Book.findById(bookId);
        // console.log(book,"number of book")
        if (!book || book.numberOfCopies <= 0) {
            return res.status(400).json({ message: 'Book is not available for borrowing' });
        }

        const borrowRecord = await BorrowedBook.create({
            book: bookId,
            user: userId,
        });

        book.numberOfCopies -= 1;
        await book.save();

        res.status(201).json({
            status: 'success',
            data: {
                borrowRecord,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
            error: error.message,
        });
    }
};


const returnBook = async (req, res) => {
    try {
        // Find the borrowing record and update it
        const { borrowingid } = req.params
        const borrowRecord = await BorrowedBook.findById(borrowingid);

        if (!borrowRecord) {
            return res.status(404).json({ message: 'Borrow record not found' });
        }

        if (borrowRecord.bookReturned) {
            return res.status(400).json({ message: 'Book already returned' });
        }

        // Mark the book as returned
        borrowRecord.bookReturned = true;
        await borrowRecord.save();


        const book = await Book.findById(borrowRecord.book);
        if (book) {
            book.numberOfCopies += 1;
            await book.save();
        }

        // Respond with success
        res.status(200).json({
            status: 'success',
            data: {
                returnedBook: borrowRecord,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
            error: error.message,
        });
    }
};


const borrowHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const borrowRecords = await BorrowedBook.find({ user: userId }).populate('book');

        res.status(200).json({
            status: 'success',
            data: {
                borrowRecords,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
            error: error.message,
        });
    }
};


const mostBorrowedBooks = async (req, res) => {
    try {

        const books = await BorrowedBook.aggregate([
            {
                $lookup: {
                    from: "books",
                    localField: "book",
                    foreignField: "_id",
                    as: "bookDetails",
                },
            },
            {
                $unwind: "$bookDetails",
            },
            {
                $group: {
                    _id: "$bookDetails.title",
                    booksCount: { $sum: 1 },
                },
            },
            {
                $sort: { booksCount: -1 },
            },
            {
                $addFields: {
                    book: "$_id",
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
        ]);


        res.status(200).json({
            status: "success",
            data: {
                books,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
            error: error.message,
        });
    }
};


const activeMembers = async (req, res) => {
    try {

        const members = await Borrowedbook.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                $unwind: "$userDetails",
            },
            {
                $group: {
                    _id: "$userDetails.name",
                    borrowCount: { $sum: 1 },
                },
            },

            {
                $addFields: {
                    member: "$_id",
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
        ]);


        res.status(200).json({
            status: 'success',
            data: {
                members,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
            error: error.message,
        });
    }
};


const bookAvailability = async (req, res, next) => {
    try {

        const totalBooks = await Book.countDocuments();


        const borrowedBooks = await Borrowedbook.aggregate([
            {
                $group: {
                    _id: "$book",
                    borrowCount: { $sum: 1 },
                },
            },
        ]);


        const availableBooks = totalBooks - borrowedBooks.length;

        res.status(200).json({
            status: "success",
            data: {
                totalBooks,
                borrowedBooks: borrowedBooks.length,
                availableBooks,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message,
        });
    }
};



module.exports = {
    borrowBook, returnBook, borrowHistory, mostBorrowedBooks, activeMembers, bookAvailability
}