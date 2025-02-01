import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Ensure bcrypt is imported

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Avoids unnecessary spaces
    },
    email: {
      type: String,
      required: true,
      unique: true, // Index for faster lookups
      lowercase: true, // Standardized format
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    collage: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      default: "", // Prevents null values
    },
    branch: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      unique: true,
      match: /^\d{10}$/, // Ensures valid 10-digit phone numbers
    },
    position: {
      type: String,
      enum: ["I", "II", "III", "IV", "V", "Alumni"],
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // Fixed typo
);

// ✅ Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Hash only if modified
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Compare password for authentication
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
