// controllers/authController.js

// Import necessary modules
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating JWT tokens
const User = require('../models/userModel'); // User model
const otpUtil = require('../utils/otpUtil'); // Utility for OTP generation

// 1. Signup controller function
exports.signup = async (req, res) => {
    // Destructure user details from request body
    const { name, mobile, email, dob, gender, address, password } = req.body;

    // Check if request body is empty
    if (!Object.keys(req.body).length) {
        return res.status(400).json({ msg: 'Request body cannot be empty!' });
    }

    // Array to hold validation errors
    const errors = [];

    // Validate user details
    //1. Validate name if length is more than 3 and less than 51
    if (!name || name.length < 3 || name.length > 50) {
        errors.push('Name must be between 3 and 50 characters');
    }
    //2. Validate mobile if length is more than or less than 10
    if (!mobile || mobile.length !== 10) {
        errors.push('Mobile number must be 10 digits long');
    }
    //3. Validate email to check the correct format
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        errors.push('Invalid email format');
    }
    //4. Validate dob if the format is correct i.e. yyyy-mm-dd
    if (!dob || !(/^\d{4}-\d{2}-\d{2}$/).test(dob)) {
        errors.push('Invalid date of birth format. Use YYYY-MM-DD');
    }
    //5. Validate gender and check if it's incorrect
    if (!gender || !['Male', 'male', 'Female', 'female', 'Other', 'other'].includes(gender)) {
        errors.push('Invalid gender');
    }
    //6. Validate address length must be more than 0
    if (!address || address.length === 0) {
        errors.push('Address is required');
    }
    //7. Validate password's length must be more than 6
    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    // If there are validation errors, send them in response
    if (errors.length) {
        return res.status(400).json({ msg: errors.join(', ') });
    }

    try {
        // Check if the user already exists based on email number
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        
        // Generate salt for password hashing
        const salt = await bcrypt.genSalt(10);
        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP and set expiration time (1 hour)
        const otp = otpUtil.generateOtp();
        const otpExpires = Date.now() + 3600000; // 1 hour in milliseconds

        // Create a new user instance
        const newUser = new User({
            name,
            mobile,
            email,
            dob,
            gender,
            address,
            password: hashedPassword,
            otp,
            otpExpires,
        });

        // Save the new user to the database
        await newUser.save();

        // Send success response with OTP (for demo purposes; in production purpose, send via SMS)
        res.status(201).json({ msg: 'User registered. OTP sent to mobile.', otp });
    } catch (err) {
        console.error(err);
        // Send server error response
        res.status(500).json({ msg: 'Server error' });
    }
};

// 2. verifyOtp controller function
// Controller function to verify OTP which was received at the time of singing-up
exports.verifyOtp = async (req, res) => {
  // Destructure mobile and OTP from request body
  const { mobile, otp } = req.body;

  // Check if request body is empty
  if (!Object.keys(req.body).length) {
      return res.status(400).json({ msg: 'Request body cannot be empty, Unauthorized' });
  }

  // Check if both mobile and OTP are provided
  if (!mobile || !otp) {
      return res.status(400).json({ msg: 'Mobile and OTP are required' });
  }

  try {
      // Find the user by mobile number
      const user = await User.findOne({ mobile });
      if (!user) {
          return res.status(400).json({ msg: 'Invalid mobile number or OTP' });
      }

      // Verify the provided OTP against the stored OTP and check expiration
      if (otpUtil.verifyOtp(otp, user.otp, user.otpExpires)) {
          // Generate JWT token for the authenticated user
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
              expiresIn: '1h', // Token expiration time
          });

          // Clear OTP and its expiration time from the user's record
          user.otp = undefined;
          user.otpExpires = undefined;
          await user.save(); // Save the updated user record

          // Respond with the generated JWT token
          res.json({ token });
      } else {
          // Respond with an error if OTP is invalid
          res.status(400).json({ msg: 'Invalid OTP' });
      }
  } catch (err) {
      console.error(err);
      // Respond with a server error message in case of an exception
      res.status(500).json({ msg: 'Server error' });
  }
};

// 3. login controller function
// Controller function for user login
exports.login = async (req, res) => {
  // Destructure email and password from request body
  const { email, password } = req.body;

  // Check if request body is empty
  if (!Object.keys(req.body).length) {
      return res.status(400).json({ msg: 'Request body cannot be empty, Unauthorized' });
  }

  // Check if both email and password are provided
  if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Compare provided password with stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Generate JWT token for the authenticated user
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '1h', // Token expiration time
      });

      // Send success response with JWT token
      res.json({ success: true, message: 'Login successful', token });
  } catch (err) {
      console.error(err);
      // Respond with a server error message in case of an exception
      res.status(500).json({ msg: 'Server error' });
  }
};

// 4. fogotPassword controller function
// Controller function to handle forgot password requests
exports.forgotPassword = async (req, res) => {
  // Destructure email from request body
  const { email } = req.body;

  // Check if request body is empty
  if (!Object.keys(req.body).length) {
      return res.status(400).json({ msg: 'Request body cannot be empty, Unauthorized' });
  }

  // Check if email is provided
  if (!email) {
      return res.status(400).json({ msg: 'Email is required' });
  }

  try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ msg: 'Invalid email' });
      }

      // Generate OTP and set expiration time (1 hour)
      const otp = otpUtil.generateOtp();
      user.otp = otp;
      user.otpExpires = Date.now() + 3600000; // 1 hour in milliseconds
      await user.save(); // Save the updated user record

      // Send success response with OTP (for demo purposes; in production, send via email)
      res.json({ msg: 'OTP sent to email.', otp });
  } catch (err) {
      console.error(err);
      // Respond with a server error message in case of an exception
      res.status(500).json({ msg: 'Server error' });
  }
};

// 5. resetPassword controller function
// Controller function to handle password reset requests
exports.resetPassword = async (req, res) => {
  // Destructure email, OTP, and newPassword from request body
  const { email, otp, newPassword } = req.body;

  // Check if request body is empty
  if (!Object.keys(req.body).length) {
      return res.status(400).json({ msg: 'Request body cannot be empty, Unauthorized' });
  }

  // Check if email, OTP, and newPassword are provided
  if (!email || !otp || !newPassword) {
      return res.status(400).json({ msg: 'Email, OTP, and new password are required' });
  }

  try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ msg: 'Invalid email or OTP' });
      }

      // Verify the provided OTP against the stored OTP and check expiration
      if (otpUtil.verifyOtp(otp, user.otp, user.otpExpires)) {
          // Generate salt and hash the new password
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(newPassword, salt);

          // Clear OTP and its expiration time from the user's record
          user.otp = undefined;
          user.otpExpires = undefined;
          await user.save(); // Save the updated user record

          // Send success response for password reset
          res.json({ msg: 'Password reset successful' });
      } else {
          // Respond with an error if OTP is invalid
          res.status(400).json({ msg: 'Invalid OTP' });
      }
  } catch (err) {
      console.error(err);
      // Respond with a server error message in case of an exception
      res.status(500).json({ msg: 'Server error' });
  }
};

// 5. signOut controller function
// Controller function to handle user sign out requests
exports.signOut = async (req, res) => {
  try {
      // Clear the 'access_token' cookie to log the user out
      res.clearCookie('access_token');

      // Send success response indicating the user has been logged out
      res.status(200).json('User has been logged out!');
  } catch (err) {
      console.error(err);
      // Respond with a server error message in case of an exception
      res.status(500).json({ msg: 'Server error' });
  }
};
