const { Router } = require('express')
const { userSignup, userLogin } = require('../controllers/userAuthController')
const router = Router()

router.post('/signup', userSignup)
    .post('/login', userLogin)


module.exports = router