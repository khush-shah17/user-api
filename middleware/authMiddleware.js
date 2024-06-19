// middleware/authMiddleware.js

// Import the jsonwebtoken module for token handling
const jwt = require('jsonwebtoken');

// Middleware function to handle user authentication
module.exports = (req, res, next) => {
  // Extract the token from the Authorization header (if present)
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // Check if token is missing
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    // Verify and decode the token using the JWT_SECRET from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user information to the request object
    req.user = decoded;
    
    // Call the next middleware or route handler
    next();
  } catch (error) {
    // Handle and log authentication errors
    console.error('Authentication error:', error.message);
    
    // Respond with an invalid token error
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
