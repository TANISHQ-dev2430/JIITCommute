const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: { type: String, required: true, minlength: [3, 'First name must be at least 3 characters'] },
    lastname: { type: String, minlength: [3, 'Last name must be at least 3 characters'] },
  },
  enrollmentNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function (value) { return /^[0-9]{1,15}$/.test(value); },
      message: 'Enrollment number must not more than 15 digits',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function (value) {
        // Only allow college email domain (e.g., @mail.jiit.ac.in)
        return /@mail\.jiit\.ac\.in$/.test(value);
      },
      message: 'Email must be a valid college email (e.g., ...@jiit.ac.in)',
    },
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  mobileNo: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (value) {
        return /^[0-9]{10}$/.test(value); 
      },
      message: 'Mobile number must be exactly 10 digits',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  hiddenTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
  fcmToken: {
    type: String,
    default: null,
  }
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { id: this._id, enrollmentNumber: this.enrollmentNumber },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  return token;
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;