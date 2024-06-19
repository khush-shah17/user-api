// controllers/userController.js

// Import the User model
const User = require('../models/userModel');

// Controller function to handle profile updates
exports.updateProfile = async (req, res) => {
  try {
    // Destructure user information from the request body
    const { name, mobile, dob, gender, address } = req.body;
    const userId = req.user.id; // Assuming the authMiddleware attaches user info to req.user

    // Check if the request body is empty
    if (!Object.keys(req.body).length) {
      return res.status(401).json({ success: false, message: 'Request body cannot be empty, Unauthorized!' });
    }

    // Check for empty fields in the provided data
    const allFields = { name, mobile, dob, gender, address };
    const emptyFields = Object.entries(allFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    // Return error if any required field is empty
    if (emptyFields.length) {
      return res.status(400).json({ success: false, message: `${emptyFields.join(', ')} cannot be empty if provided` });
    }

    // Update the user profile in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, mobile, dob, gender, address },
      { new: true } // Return the updated document
    );

    // Check if user is not found in the database
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Send success response with the updated user information
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    // Handle and log any errors that occur during profile update
    console.error('Error updating profile:', error.message);
    res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
  }
};
