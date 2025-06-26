const User = require('../models/user.model');
const BlacklistToken = require('../models/blacklistToken.model'); 
const jwt = require('jsonwebtoken');
module.exports.createUser = async ({ 
    firstname, lastname, enrollmentNumber, batch, mobileNo, password
}) => { 
    if (!firstname || !enrollmentNumber || !batch || !mobileNo || !password) {
        throw new Error('First name, enrollment number, batch, mobile number, and password are required');
    }

    const user = await User.create({
        fullname: { firstname, lastname },
        enrollmentNumber,
        batch,
        mobileNo,
        password
    });

    return {
        _id: user._id,
        enrollmentNumber: user.enrollmentNumber,
        fullname: user.fullname,
        batch: user.batch,
        mobileNo: user.mobileNo
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