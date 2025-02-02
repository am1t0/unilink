import User from "../models/user.model.js";
import ApiError from "../utilities/ApiError.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import jwt from "jsonwebtoken";

// Function to generate JWT tokens
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, collageName } = req.body;
    if (!name || !email || !password || !collageName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }

    const newLink = await User.create({
      name,
      email,
      password,
      collage: collageName,
    });

    const token = signToken(newLink._id);

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      httpOnly: true, // prevents XSS attacks
      sameSite: "strict", // prevents CSRF attacks
      secure: process.env.NODE_ENV === "production" ?true : false,
    });

    res.status(201).json({
      success: true,
      link: newLink,
    });
  } catch (error) {
    console.log("Error in register controller:", error);
    return res.status(500).json({ success: false, message: "Server error in register" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const link = await User.findOne({ email }).select("+password");

    if (!link || !(await link.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = signToken(link._id);

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      httpOnly: true, // prevents XSS attacks
      sameSite: "strict", // prevents CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      link,
    });
  } catch (error) {
    console.log("Error in login controller:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export const sendMe = asyncHandler((req, res) => {
  try {
    res.send({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.log("Error in sendMe controller:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export { registerUser, loginUser };
