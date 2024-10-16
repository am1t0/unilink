import ApiError from "../utilities/ApiError.js";
import ApiResponse from "../utilities/ApiResponse.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import { uploadOnCloudinary } from "../utilities/cloudinary.js";
import { query as db } from "../db/index.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  //get user details
  const { name, email, password, username } = req.body;

  //Validation-Checking
  if ([name, email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All Fields Are Required");
  }

  const createUser = async ({ name, avatar, email, password, username }) => {
    try {
      // Insert user data into the PostgreSQL database
      const query = `
                INSERT INTO users (name, avatar, email, password, username)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `;
      const values = [name, avatar || "", email, password, username.toLowerCase()];

      // Execute the query
      const result = await db(query, values);

      // Return the newly created user
      return result
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  // Example usage
  const user = await createUser({
    name: name,
    profile_img: "",
    email: email,
    password: password,
    username: username
  });

  console.log(user);
});

export { registerUser };
