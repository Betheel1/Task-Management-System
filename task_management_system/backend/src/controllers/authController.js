const User =require( "../models/user.js");
const jwt =require( "jsonwebtoken");
const  AppError  =require( "../utils/appError.js"); 
const asyncWraper=require('../utils/asyncWraper.js')
// Function to register a new user
 const registerUser = async (req, res, next) => {
  const {  email, password, role,firstName,lastName } = req.body; // Add role here if needed

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError("User already exists", 400));
  }

  // If role is not provided, set it to 'user' by default
  const userRole = role || "user";

  // Create a new user
  const user = await User.create({
    
    email,
    name:firstName + " "+ lastName,
    password,
    role: userRole,
  });

  // Send success response
  res.status(201).json({
    message: "User registered successfully",
    user: {
      name: user.name,
      email: user.email,
      role: user.role, // Include role in response
    },
  });
};

// Function to login user and generate JWT
 const loginUser = async (req, res, next) => {
  console.log(req.body)
  const { email, password } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new AppError("Invalid email or password", 401));
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, role: user.role,name:user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d", // Token expires in 30 days
    }
  );

  // Send success response with token
  res.status(200).json({
    message: "User logged in successfully",
    token,
  });
};



// Protect routes
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    req.user = user; // Attach user to request object
    next();
  } catch (err) {
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
};
const getAllUsers = asyncWraper(async (req, res, next) => {
  const users = await User.find({}, "name email");

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

module.exports = { loginUser, registerUser, protect,getAllUsers };