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
             enum: ["Like", "Comment", "Follow", "Mention"],
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
            default: "websocket",
        }
       },
       { timestamps: true } 
)

export default mongoose.model("Notification", notificationSchema)