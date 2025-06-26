const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authMiddleware'); 

router.post('/register', [
    body('enrollmentNumber').matches(/^[0-9]{1,15}$/).withMessage('Enrollment number must be 1 to 15 digits'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('batch').matches(/^[A-Za-z][A-Za-z0-9]{1,9}$/).withMessage('Batch must start with an alphabet followed by up to 9 alphanumeric characters'),
    body('mobileNo').matches(/^[0-9]{10}$/).withMessage('Mobile number must be exactly 10 digits'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], userController.registerUser);

router.post('/login', [
    body('enrollmentNumber').matches(/^[0-9]{1,15}$/).withMessage('Enrollment number must be 1 to 15 digits'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], userController.loginUser);

router.get('/profile', authMiddleware, userController.getUserProfile);

router.post('/logout', authMiddleware, userController.logoutUser);

// Save FCM token for the authenticated user
router.post('/save-fcm-token', authMiddleware, userController.saveFcmToken);

module.exports = router;