import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Requested", "Link"],
      required: true,
      default: "Requested", // Default status when a request is created
    },
  },
  { timestamps: true } 
);

export default mongoose.model("Link", linkSchema);
