const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Staff = require("./../models/staffModel");
const CustomError = require("../customError");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

exports.signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await Staff.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token,
    });
  } else {
    throw new CustomError("Invalid email or password", 409);
  }
});

exports.signup = asyncHandler(async (req, res) => {
    const { firstName, lastName, role, email, password } = req.body;
    if (!firstName || !lastName || !role || !email || !password) {
      throw new CustomError("All fields are required", 400);
    }
    const user = await Staff.findOne({ email });
  
    if (user) {
      throw new CustomError(
        "Account with this email already exists. Please Sign In",
        409
      );
    } else {
      const newUser = new Staff({
        firstName,
        lastName,
        role,
        email,
        password,
      });
  
      // Save the new user to the database
      await newUser.save();
  
      // Generate a token for the new user
      const token = generateToken(newUser._id);
  
      // Return a success response with user data and token
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          _id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role,
        },
        token,
      });
    }
  });
  