const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authMiddleware'); 

// Email OTP endpoints
router.post('/send-email-otp', userController.sendEmailOtp);
router.post('/verify-email-otp', userController.verifyEmailOtp);

router.post('/register', [
    body('enrollmentNumber').matches(/^[0-9]{1,15}$/).withMessage('Enrollment number must be 1 to 15 digits'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('email').matches(/^[a-zA-Z0-9._%+-]+@mail\.jiit\.ac\.in$/).withMessage('Email must be a valid JIIT college email'),
    body('mobileNo').matches(/^[0-9]{10}$/).withMessage('Mobile number must be exactly 10 digits'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], userController.registerUser);

router.post('/login', [
    body('enrollmentNumber').matches(/^[0-9]{1,15}$/).withMessage('Enrollment number must be 1 to 15 digits'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], userController.loginUser);

router.get('/profile', authMiddleware, userController.getUserProfile);

// PATCH for profile update (including email)
router.patch('/profile', authMiddleware, userController.updateUserProfile);

router.post('/logout', authMiddleware, userController.logoutUser);

// Save FCM token for the authenticated user
router.post('/device-token', authMiddleware, userController.saveFcmToken);

module.exports = router;