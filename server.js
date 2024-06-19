// server.js

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Import route handlers
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize the Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use route handlers
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes); // Route for user-related API endpoints

// Define the port from environment variables or use default port 3000
const PORT = process.env.PORT || 3000;

// Connect to MongoDB using connection string from environment variables
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // Log successful connection to MongoDB
    console.log('Connected to MongoDB');

    // Start the Express server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    // Log any errors connecting to MongoDB
    console.error('Error connecting to MongoDB:', err.message);
  });
