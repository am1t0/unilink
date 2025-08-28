import User from "../models/user.model.js";
import cloudinary from "../utilities/cloudinary.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator"
import { validateCollegeEmail } from "../utilities/emailValidation.js";
import { sendOtp } from "./mail.controller.js";


//replace with REDIS IN FUTURE
const otpStore = new Map();

/**
 * @desc Send Otp for email verification
 * @route POST /api/v1/auth/mail-verify
 * @access Private
 */
export const verifyCollegeEmail = asyncHandler(async (req, res) => {
  const { email, college } = req.body;

  try {
    if (!email || !college) {
      return res.status(400).json({ error: "Email and college are required" });
    }

    //check whether mail is already in use
    const user = await User.findOne({ email });

    // Check if email is already in use
    if (user) {
      if (user.verified) {
        return res.status(200).json({ move: true, message: "Email already verified" });
      } else {
        return res.status(409).json({ error: "Email already in use but not verified" }); // Conflict
      }
    }

    //check if email is valid for the selected college
    const isValid = validateCollegeEmail(email, college);

    if (!isValid) {
      return res.status(400).json({ error: "Invalid college email" });
    }

    // Generate and send OTP
    const otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    // CACHE TYPE STORAGE   
    otpStore.set(email, { otp, expires: Date.now() + 2 * 60 * 1000 });  //2 minutes expiry 

    await sendOtp(email, otp);

    return res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {

    return res.status(400).json({
      success: false,
      message: "Error sending image",
    });
  }

});

/**
 * @desc Otp verification
 * @route POST /api/v1/auth/otp-verify
 * @access Private
 */
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, college, otp } = req.body;
  try {
    if (!email || !otp || !college) {
      return res.status(400).json({ error: "Email, College and OTP are required" });
    }
    const data = otpStore.get(email);

    if (!data) return res.status(404).send({ error: 'OTP not found' });
    if (Date.now() > data.expires) return res.status(400).send({ error: 'OTP expired' });
    if (data.otp !== otp) return res.status(400).send({ error: 'Invalid OTP' });

    otpStore.delete(email); // Clear OTP after verification

    res.send({ move: true, message: 'OTP verified successfully' });

  } catch (error) {
    return res.status(500).json({
      error: "Server error during OTP verification",
    });
  }
});

// Function to generate JWT tokens
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, password, college, email } = req.body;

    if (!name || !password || !college || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // now add name and password of user
    const user = await User.create({
      name,
      password,
      email,
      college
    })
    await user.save();

    const token = signToken(newLink._id);

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      httpOnly: true, // prevents XSS attacks
      sameSite: "strict", // prevents CSRF attacks
      secure: process.env.NODE_ENV === "production" ? true : false,
    });

    res.status(201).json({
      success: true,
      link: newLink,
    });
  } catch (error) {
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


export const updateProfile = async (req, res) => {
  // image => cloudinary -> image.cloudinary.your => mongodb

  try {
    const { image, ...otherData } = req.body;

    let updatedData = otherData;

    if (image) {
      // base64 format
      if (image.startsWith("data:image")) {
        // Calculate the file size in bytes
        const base64Length = image.length;
        const padding = (image.endsWith("==") ? 2 : (image.endsWith("=") ? 1 : 0));
        const fileSizeInBytes = (base64Length * 3) / 4 - padding;

        // Define the upload limit (e.g., 0.1 MB)
        const uploadLimitInBytes = 0.1 * 1024 * 1024; // 0.1 MB

        // Check if the file size exceeds the limit
        if (fileSizeInBytes > uploadLimitInBytes) {
          return res.status(400).json({
            success: false,
            message: "Image size exceeds the upload limit of 100kb",
          });
        }

        try {
          const uploadResponse = await cloudinary.uploader.upload(image);
          updatedData.avatar = uploadResponse.secure_url;
        } catch (error) {
          console.error("Error uploading image:", error);

          return res.status(400).json({
            success: false,
            message: "Error uploading image",
          });
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true });

    return res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("jwt")
  res.status(200).json({ success: true, message: "Logged out successfully" });
}

export const uploadProfileImage = asyncHandler(async (req, res) => {
  try {
    const localFilePath = req.file?.path;

    if (!localFilePath) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required"
      });
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(localFilePath);

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: result.secure_url },
      { new: true }
    );

    res.status(200).json({
      success: true,
      avatar: result.secure_url,
      message: "Profile image updated successfully"
    });

  } catch (error) {
    console.log("Error in uploadProfileImage: ", error);
    res.status(500).json({
      success: false,
      message: "Error uploading profile image"
    });
  }
});

export const uploadBannerImage = asyncHandler(async (req, res) => {
  try {
    const localFilePath = req.file?.path;

    if (!localFilePath) {
      return res.status(400).json({
        success: false,
        message: "Banner image is required"
      });
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(localFilePath);

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { banner: result.secure_url },
      { new: true }
    );

    res.status(200).json({
      success: true,
      banner: result.secure_url,
      message: "Banner image updated successfully"
    });

  } catch (error) {
    console.log("Error in uploadBannerImage: ", error);
    res.status(500).json({
      success: false,
      message: "Error uploading banner image"
    });
  }
});

export const getProfile = asyncHandler(async (req, res) => {
  try {
    const { profileId } = req.params; // Get the user ID from the request parameters
    const user = await User.findById(profileId).select("-password -phone"); // Find the user by ID

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
})

export const searchRelevantUsers = asyncHandler(async (req, res) => {
  const { searchTerm, maxResults = 10 } = req.query;
  const userId = req.user.id;

  try {
    const currentUser = await User.findById(userId).select("-password -phone");
    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    const query = {
      _id: { $ne: currentUser._id },
      collage: currentUser.collage,
      $or: [
        { name: new RegExp(searchTerm, "i") },
        { email: new RegExp(searchTerm, "i") }
      ]
    };

    const users = await User.aggregate([
      { $match: query },
      {
        $addFields: {
          relevance: {
            $add: [
              { $cond: [{ $eq: ["$degree", currentUser.degree] }, 1, 0] },
              { $cond: [{ $eq: ["$branch", currentUser.branch] }, 1, 0] },
              { $cond: [{ $eq: ["$position", currentUser.position] }, 1, 0] }
            ]
          }
        }
      },
      { $sort: { relevance: -1, name: 1 } },
      { $limit: parseInt(maxResults) },
      {
        $project: {
          name: 1,
          email: 1,
          degree: 1,
          branch: 1,
          year: 1,
          relevance: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});



export { registerUser, loginUser };
