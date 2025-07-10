const { validationResult } = require('express-validator');
const User = require('../models/user.model');
const userService = require('../services/user.service');
const nodemailer = require('nodemailer');

const emailOtpStore = {};

// Configure nodemailer transporter (use your SMTP config)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendMail(to, subject, text) {
  await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, text });
}

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, enrollmentNumber, email, mobileNo, password } = req.body;
    // Only allow college email domain (e.g., @jiit.ac.in)
    const allowedDomain = '@mail.jiit.ac.in';
    if (!email || !email.endsWith(allowedDomain)) {
        return res.status(400).json({ message: 'Email must be a valid college email (e.g., ...@jiit.ac.in)' });
    }

    try {
        const existingUser = await User.findOne({ enrollmentNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'Enrollment number already exists' });
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        // Check OTP verification
        if (!emailOtpStore[email] || !emailOtpStore[email].verified) {
            return res.status(400).json({ message: 'Please verify your college email before registering.' });
        }
        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            enrollmentNumber,
            email,
            mobileNo,
            password,
            emailVerified: true
        });
        // Remove OTP from store after use
        delete emailOtpStore[email];
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
// PATCH /users/profile (update profile, including email and verification)
module.exports.updateUserProfile = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const updates = {};
        if (req.body.fullname) updates['fullname'] = req.body.fullname;
        if (req.body.mobileNo) updates['mobileNo'] = req.body.mobileNo;
        if (req.body.email) {
            // If email is changed, require verification
            if (!emailOtpStore[req.body.email] || !emailOtpStore[req.body.email].verified) {
                return res.status(400).json({ message: 'Please verify your college email before saving.' });
            }
            updates['email'] = req.body.email;
            updates['emailVerified'] = true;
            delete emailOtpStore[req.body.email];
        }
        if (req.body.removeProfileImage) updates['profileImage'] = null;
        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update profile.' });
    }
};
module.exports.getUserProfile = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Fetch the latest user data from the database
        const user = await User.findById(req.user._id).select('-password -createdAt -updatedAt');
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

module.exports.sendEmailOtp = async (req, res) => {
  const { email } = req.body;
  if (!email || !/^([a-zA-Z0-9._%+-]+)@mail\.jiit\.ac\.in$/.test(email)) {
    return res.status(400).json({ message: 'Invalid college email' });
  }
  // Check if email is already used by another user (for registration, not for profile update)
  const user = await User.findOne({ email });
  if (user && (!req.user || user._id.toString() !== req.user._id.toString())) {
    return res.status(400).json({ message: 'This email is already in use.' });
  }
  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
  emailOtpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };
  try {
    await sendMail(email, 'Your JIITCommute OTP', `Your OTP for JIITCommute registration is: ${otp}`);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP email' });
  }
};

module.exports.verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }
  const record = emailOtpStore[email];
  if (!record || record.otp !== otp || Date.now() > record.expires) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }
  emailOtpStore[email].verified = true;
  res.status(200).json({ message: 'Email verified' });
};