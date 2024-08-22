const User = require('../models/userAuthModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretkey = process.env.SECRET_KEY;

const userverifytoken = async (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(400).json({ error: "Token is required" });
    }

    try {
        const decoded = jwt.verify(token, secretkey);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        req.user = user; 
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ errorMessage: 'Invalid token' });
    }
};

module.exports = userverifytoken;
