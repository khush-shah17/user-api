// routes/userRoutes.js

// Import the Express module and create a Router instance
const express = require('express');
const router = express.Router();

// Import the authentication middleware for route protection
const authMiddleware = require('../middleware/authMiddleware');

// Import the user controller for handling user-related operations
const userController = require('../controllers/userController');

// Define the route to update user profile, protected by authentication middleware
router.put('/update-profile', authMiddleware, userController.updateProfile);

// Export the router for use in the main application
module.exports = router;
