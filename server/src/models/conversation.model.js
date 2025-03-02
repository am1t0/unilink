import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message", // Stores the last sent message for quick access
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", ConversationSchema);
