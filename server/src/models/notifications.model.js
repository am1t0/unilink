import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Like", "Comment", "Link", "Mention", "Link-Accepted", "Link-Ignored"],
      required: true,
    },
    status: {
      type: String,
      enum: ["read", "unread"],
      default: "unread",
    },
    deliveryMethod: {
      type: String,
      enum: ["socket", "email"],
      default: "socket",
    },


    // Conditionally required fields (based on type)
    linkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Link',
    },
    
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },

    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },

    response: {
      type: String,
    }
  },
  { timestamps: true }
)

export default mongoose.model("Notification", notificationSchema)