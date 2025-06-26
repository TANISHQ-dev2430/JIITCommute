const { validationResult } = require('express-validator');
const User = require('../models/user.model');
const userService = require('../services/user.service');

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, enrollmentNumber, batch, mobileNo, password } = req.body;

    try {
        const existingUser = await User.findOne({ enrollmentNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'Enrollment number already exists' });
        }

        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            enrollmentNumber,
            batch,
            mobileNo,
            password
        });

        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { enrollmentNumber, password } = req.body;

    try {
        const user = await User.findOne({ enrollmentNumber }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid enrollment number or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid enrollment number or password' });
        }

        const token = user.generateAuthToken();

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'none', 
            secure: true    
        });

        res.status(200).json({ token, user: { _id: user._id, enrollmentNumber, fullname: user.fullname, batch: user.batch, mobileNo: user.mobileNo } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports.getUserProfile = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Fetch the latest user data from the database
        const user = await User.findById(req.user._id).select('-password -createdAt -updatedAt -email'); // Exclude password, createdAt, updatedAt, and email
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports.logoutUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }

        await userService.blacklistToken(token);

        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.saveFcmToken = async (req, res) => {
    try {
        const userId = req.user.id;
        const { token } = req.body;
        if (!token) return res.status(400).json({ message: 'No FCM token provided' });
        await User.findByIdAndUpdate(userId, { fcmToken: token });
        res.status(200).json({ message: 'FCM token saved' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to save FCM token' });
    }
};