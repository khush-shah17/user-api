// models/userModel.js

const mongoose = require('mongoose');

// Define the user schema with mongoose
const userSchema = new mongoose.Schema({
  // Name field with validation for required, minlength, and maxlength
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [50, 'Name must be less than 50 characters long'],
  },
  // Mobile field with validation for required, unique, length, and regex pattern
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: true,
    minlength: [10, 'Mobile number must be at least 10 digits long'],
    maxlength: [10, 'Mobile number must be less than 11 digits long'],
    match: [/^\d{10}$/, 'Mobile number must be 10 digits'],
  },
  // Email field with validation for required, unique, and regex pattern
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Email format is invalid'],
  },
  // Date of birth field with validation for required
  dob: {
    type: Date,
    required: [true, 'Date of birth is required'],
  },
  // Gender field with validation for required and enum values
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'male', 'Female', 'female', 'Other', 'other'], // Enum validation
  },
  // Address field with validation for required
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  // Password field with validation for required and minlength
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  // OTP field (optional)
  otp: {
    type: String,
  },
  // OTP expiration field (optional)
  otpExpires: {
    type: Date,
  },
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt fields

// Export the User model based on the userSchema
module.exports = mongoose.model('User', userSchema);
