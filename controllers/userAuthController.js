const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userAuthModel')
const CustomErrors = require('../utils/customErrors')
require('dotenv').config()

const userSignup = async (req, res) => {

    const { name, email, password, role } = req.body
    try {
        const userExists = await User.findOne({ email })

        if (userExists) {
            return res.status(400).json({ message: 'User already registred with email id' })
        }

        const hashedpassword = await bcrypt.hash(password, 10)

        const user = new User({
            name,
            email,
            password: hashedpassword,
            role
        })

        const savedUserDetails = await user.save()

        res.status(200).json({
            message: 'User signup successfully',
            savedUserDetails,
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            status: "Something went wrong",
            errorMessage: error.message,
            error,
        })
    }



}

const userLogin = async (req, res) => {
    const { email, password } = req.body
    const secretkey = process.env.SECRET_kEY

    try {
        const user = await User.findOne({ email })

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Entered Email or password doesn't exists in database" })
        }

        const token = jwt.sign({ userId: user._id }, secretkey, { expiresIn: '8h' })

        if (!token) {
            return res.status(400).json({ error: "Token not found" })
        }

        const userId = user._id
        res.status(200).json({
            success: 'Login is successfull',
            user,
            token,
            userId,
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            status: "Something went wrong",
            errorMessage: error.message,
            error,
        })
    }


}




module.exports = {
    userSignup,
    userLogin,
}