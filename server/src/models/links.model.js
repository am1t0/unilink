import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensuring no null values
    },
    requestPersonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["requested", "accepted"],
      required: true,
      default: "requested", // Default status when a request is created
    },
  },
  { timestamps: true } // Fixed typo
);

export default mongoose.model("Link", linkSchema);
