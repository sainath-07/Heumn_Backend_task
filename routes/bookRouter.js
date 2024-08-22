const { Router } = require('express')
const { addbook, updatebook, deletebook, listBooks, } = require('../controllers/bookController')
const userverifytoken = require('../verifyUserToken/userToken')
const restrictUser = require('../utils/restrictUser');

const router = Router()

router.post('/addbooks', userverifytoken
    , restrictUser('admin'), addbook)
    .put('/updatebook/:bookid', userverifytoken
        , restrictUser('admin'), updatebook)
    .delete('/deletebook/:bookid', userverifytoken
        , restrictUser('admin'), deletebook)
    .get('/listAllBooks', userverifytoken
        , restrictUser('admin'), listBooks)



module.exports= router