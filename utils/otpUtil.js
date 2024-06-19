// utils/otpUtil.js

// Function to generate a 6-digit OTP (One-Time Password)
const generateOtp = () => {
    // Generate a random number between 100000 and 999999 and convert it to a string
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to verify if the input OTP matches the user's stored OTP and is not expired
const verifyOtp = (inputOtp, userOtp, otpExpires) => {
    // Check if the input OTP matches the user's stored OTP and the OTP is not expired
    return inputOtp === userOtp && Date.now() < otpExpires;
};

// Export the functions for use in other modules
module.exports = { generateOtp, verifyOtp };
