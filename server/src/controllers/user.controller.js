import ApiError from "../utilities/ApiError.js";
import ApiResponse from "../utilities/ApiResponse.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import { uploadOnCloudinary } from "../utilities/cloudinary.js";
import { query as db } from "../db/index.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

//------CONTROLLER UTILITIES ----------//

// Function to generate JWT tokens
const generateTokens =  async (userId) => {

  try {
  const accessToken = jwt.sign(
    { _id: userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
  const refreshToken = jwt.sign(
    { _id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
  return { accessToken, refreshToken };

} catch (error) {
  throw new ApiError(500, "Something went wrong while generating refresh and access token")
}

};

const registerUser = asyncHandler(async (req, res) => {
  try {
    // Get user details from the client
    const {
      name,
      email,
      password,
      phone_number = null, // If phone_number is not provided, set it to null
      profile_img = null,  // Same for profile_img
      bio = null,          // Same for bio
      branch = null,       // Same for branch
      college_name = null, // Same for college_name
      degree = null,       // Same for degree
      gender = null,       // Same for gender
      dob = null,          // Same for dob
      city = null,         // Same for city
      state = null,        // Same for state
      local_address = null,      // Same for address
      role,                // 'student' or 'alumni'
      studentData = {},    // Default empty object for student data
      alumniData = {}      // Default empty object for alumni data
    } = req.body;

    // Validation - Checking required fields
    if ([name, email, password,username].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "Name, Email, and Password are required");
    }

    // Ensure the role is either 'student' or 'alumni'
    if (!['student', 'alumni'].includes(role)) {
      throw new ApiError(400, "Invalid role");
    }

    // Checking if user already exists
    const existedUser = await db('SELECT email FROM users WHERE email = $1', [email]);

    if (existedUser.rows.length > 0) {
      throw new ApiError(409, "User with this email already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the base user into the users table with optional fields handled
    const result = await db(
      `INSERT INTO users (name, email, username, password, phone_number, profile_img, bio, branch, college_name, degree, gender, dob, city, local_address, role, state)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING id, name, email, phone_number,username, profile_img, bio, branch, college_name, degree, gender, dob, city, local_address, role, state, created_at, updated_at`,
      [name, email,  username,hashedPassword, phone_number, profile_img, bio, branch, college_name, degree, gender, dob, city, local_address, role, state]
    );    

    const user = result.rows[0]; // Newly created user

    // Insert into the appropriate table (students or alumni) based on the role
    if (role === 'student') {
      const { enrollment_year = null, current_year = null } = studentData;  // Default to null if not provided
      if (!enrollment_year || !current_year) {
        throw new ApiError(400, "Student data is required");
      }

      // Insert into the students table using user_id from users table
      await db(
        `INSERT INTO students (id, enrollment_year, current_year)
         VALUES ($1, $2, $3)`,
        [user.id, enrollment_year, current_year]
      );

      user.studentData = studentData;

    } else if (role === 'alumni') {
      const { graduation_year = null, willing_to_mentor = false, event_contribution = false } = alumniData;
      if (!graduation_year) {
        throw new ApiError(400, "Alumni data is required");
      }

      // Insert into the alumni table using user_id from users table
      await db(
        `INSERT INTO alumni (id, graduation_year, willing_to_mentor, event_contribution)
         VALUES ($1, $2, $3, $4)`,
        [user.id, graduation_year, willing_to_mentor, event_contribution]
      );

      user.alumniData = alumniData;
    }

    const {accessToken, refreshToken} = await generateTokens(user.id);

    // Store the refresh token in the database for the user
    await db(
      `UPDATE users SET refresh_token = $1 WHERE id = $2`,
      [refreshToken, user.id]
    );


    // Send response with access token and user info (excluding refreshToken)
    return res.status(201).json(new ApiResponse(201, { user, accessToken }, "User registered successfully"));
    
  } catch (error) {
   // Check for specific error cases or default to 500 Internal Server Error
   if (error instanceof ApiError) {
    // Return the error as it is, since it's already an ApiError
    return res.status(error.statusCode).json({ status: error.statusCode, message: error.message });

  } else {
    // Log the error for internal use and return a generic message
    console.error("Unexpected Error: ", error);
    return res.status(500).json(new ApiError(500, "An unexpected error occurred"));
 }
  }
});

const loginUser = asyncHandler(async (req, res) => {

  try {
  
  // Take input from user: username or email, password
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail) {
    throw new ApiError(400, "Username or email is required");
  }

  // Find user by either username or email
  const result = await db(
    `SELECT * FROM users WHERE username = $1 OR email = $1`,
    [usernameOrEmail]
  );

  const user = result.rows[0];

  // If user does not exist
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Check if the password is correct
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateTokens(user.id);

  // Update the refresh token in the database
  await db(
    `UPDATE users SET refresh_token = $1 WHERE id = $2`,
    [refreshToken, user.id]
  );

  // Prepare the user data to return, excluding password and refreshToken
  const loggedInUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone_number: user.phone_number,
    profile_img: user.profile_img,
    bio: user.bio,
    branch: user.branch,
    college_name: user.college_name,
    degree: user.degree,
    gender: user.gender,
    dob: user.dob,
    city: user.city,
    state: user.state,
    address: user.address,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  if(user.studentData) loggedInUser.studentData = user.studentData;

  else if(user.alumniData) loggedInUser.alumniData = user.alumniData;

  // Send the response
  return res.status(200).json(new ApiResponse(200, {user: loggedInUser,accessToken},"User logged in successfully"));

   
} catch (error) {
    
   // Check for specific error cases or default to 500 Internal Server Error
   if (error instanceof ApiError) {
    // Return the error as it is, since it's already an ApiError
    return res.status(error.statusCode).json({ status: error.statusCode, message: error.message });

  } else {
    // Log the error for internal use and return a generic message
    console.error("Unexpected Error: ", error);
    return res.status(500).json(new ApiError(500, "An unexpected error occurred"));
 }

}

});





export { registerUser, loginUser };
