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
            url: { type: String },
            type: { type: String, enum: ['photo', 'video'] },
            index: { type: Number }
        },
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
    likeCount: {
        type: Number,
        default: 0,
    },
    commentCount: {
        type: Number,
        default: 0,
    },
    share: {
        type: Number,
        default: 0,
    },
    endDate: {
        type: Date,
    },
}, { timestamps: true })


export default mongoose.model('Post', PostSchema);