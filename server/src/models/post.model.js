import mongoose from "mongoose";
import User from "./user.model.js";

const PostSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
    },
    media: [
       { 
        type: String,
        required: true,
       }
    ],
    tag: {
        type: String,
        enum: ['Personal', 'Event', 'Job & Internship'],
        required: true
    },
    likedBy: [
        {
          type: mongoose.Schema.Types.ObjectId, 
          ref: "User",  // Reference to users who liked the post
        }
    ],
    share:{
        type: Number,   
        default: 0,
    },
    endDate:{
        type: Date,
    },
} ,{timestamps: true})


export default mongoose.model('Post', PostSchema);