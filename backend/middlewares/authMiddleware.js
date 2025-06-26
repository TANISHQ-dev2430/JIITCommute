const jwt = require('jsonwebtoken');
const BlacklistToken = require('../models/blacklistToken.model');
const User = require('../models/user.model'); 

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Check if the token is blacklisted
        const isBlacklisted = await BlacklistToken.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token has been blacklisted. Please log in again.' });
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET);

       
        const user = await User.findById(decoded.id); 
        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }
        req.user = user; 

        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;