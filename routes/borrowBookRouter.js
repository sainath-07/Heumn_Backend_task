const { Router } = require('express')
const userverifytoken = require('../verifyUserToken/userToken')
const { borrowBook, returnBook, borrowHistory, mostBorrowedBooks, activeMembers, bookAvailability } = require('../controllers/borrowBookController')
const router = Router()


router.post('/borrowbook/:bookId', userverifytoken, borrowBook)
    .patch('/returnBook/:borrowingid', userverifytoken, returnBook)
    .get('/borrow-history', userverifytoken, borrowHistory)
    .get('/most-borrowed-books', mostBorrowedBooks)
    .get('/activeMembers', activeMembers)
    .get('/bookAvailability', bookAvailability)

module.exports = router;