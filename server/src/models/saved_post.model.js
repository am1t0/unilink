import mongoose from "mongoose";

const savedPostSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post: [
       { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
       }
    ],
}, {timestamps: true})



export default mongoose.model('savedPost', savedPostSchema);