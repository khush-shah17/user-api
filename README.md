## Postman Documentation
https://documenter.getpostman.com/view/36375567/2sA3XTefWZ

# User API
This project implements a set of User APIs using Node.js and Express.js with MongoDB as the database. The APIs include Signup, Login, Forgot Password, Reset Password, and Profile Update.

## Features
- Signup API with OTP verification (no actual SMS sending as of now)
- Login API
- Forgot Password API
- Reset Password API
- Profile Update API

## Requirements
- Node.js
- MongoDB
- Postman (for API testing)

## Setup Instructions

## 1. Clone the repository
   ```bash
   git clone <repository_url>
   cd api

## 2. Install dependencies
npm install <dependency name>
for eg: 
   bcryptjs, body-parser, cookie-parser, cors, dotenv, express, js, jsonwebtoken, mongoose, nodemailer, nodemon

## 3. Create a .env file in the root directory and add the following:
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_generated_jwt_secret_key

##4. Start the server
npm run dev


### API/Auth Routes
- `POST /api/auth/signup` - Signup a new user and send OTP
- `POST /api/auth/verify-otp` - Verify OTP and authenticate user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Send OTP for password reset
- `POST /api/auth/reset-password` - Reset password using OTP

### User Routes
- `PUT /api/user/update-profile` - Update user profile (Requires Authentication)
