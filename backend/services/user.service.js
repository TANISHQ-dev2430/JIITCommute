const User = require('../models/user.model');
const BlacklistToken = require('../models/blacklistToken.model'); 
const jwt = require('jsonwebtoken');
module.exports.createUser = async ({ 
    firstname, lastname, enrollmentNumber, email, mobileNo, password, emailVerified
}) => { 
    if (!firstname || !enrollmentNumber || !email || !mobileNo || !password) {
        throw new Error('First name, enrollment number, email, mobile number, and password are required');
    }

    const user = await User.create({
        fullname: { firstname, lastname },
        enrollmentNumber,
        email,
        mobileNo,
        password,
        emailVerified: !!emailVerified
    });

    return {
        _id: user._id,
        enrollmentNumber: user.enrollmentNumber,
        fullname: user.fullname,
        email: user.email,
        mobileNo: user.mobileNo,
        emailVerified: user.emailVerified
    };
};


module.exports.blacklistToken = async (token) => {
    if (!token) {
        throw new Error('Token is required for blacklisting');
    }

    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000); 

    await BlacklistToken.create({ token, expiresAt });
};