// routes/authRoutes.js

// Import the Express module and create a Router instance
const express = require('express');
const router = express.Router();

// Import the necessary controller functions for authentication
const { signup, verifyOtp, login, forgotPassword, resetPassword, signOut } = require('../controllers/authController');

// Route to handle user signup
router.post('/signup', signup);

// Route to verify OTP for user authentication
router.post('/verify-otp', verifyOtp);

// Route to handle user login
router.post('/login', login);

// Route to initiate forgot password process
router.post('/forgot-password', forgotPassword);

// Route to reset user password after OTP verification
router.post('/reset-password', resetPassword);

// Route to handle user signout by clearing access token cookie
router.get('/signout', signOut);

// Export the router for use in the main application
module.exports = router;
