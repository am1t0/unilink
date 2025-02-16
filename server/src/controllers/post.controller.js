import cloudinary from "../utilities/cloudinary.js";
import Post from "../models/post.model.js";
import { asyncHandler } from "../utilities/asyncHandler.js";

export const createPost = asyncHandler( async (req, res) => {
    try {
        const { user ,description, tag, endDate } = req.body;

        //atleast one of them required to create post
        if (!media?.length && !description) {
            return res.status(400).json({
                success: false,
                message: "Either description or media is required."
            });
        }

        if (tag === "Event" && !endDate) {
            return res.status(400).json({
                success: false,
                message: "End date is required for event posts."
            });
        }

         // Access the uploaded files
         const files = req.files;
         let media = [];

         if(req.files){

         // Loop through the files to process each one
           media = await Promise.all(files.map(async (file, index) => {
             // Upload file to Cloudinary
             const cloudinaryResponse = await cloudinary.uploader.upload(file.path);
 
             if (!cloudinaryResponse) {
                 throw new ApiError(404, "Failed to upload file to Cloudinary");
             }
 
             // Determine file type (e.g., based on MIME type or file extension)
             const fileType = file.mimetype.startsWith('image') ? 'photo' : 'video';
 
             // Return the media object in the required format
             return {
                 url: cloudinaryResponse.url,    // Cloudinary's response URL
                 type: fileType,                       // 'photo' or 'video'
                 index: index                          // Index based on the file's order
             };
         }));
        }

        //create the post
        const newPost = await Post.create({
            user,
            description,
            media,
            tag,
            endDate
        });

        return res.status(201).json({
            success: true,
            post: newPost
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate("user", "name avatar");
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }
        return res.status(200).json({ success: true, post });
    } catch (error) {
        console.error("Error in getPost:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("user", "name avatar");
        return res.status(200).json({ success: true, posts });
    } catch (error) {
        console.error("Error in getAllPosts:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { description, media, tag, endDate } = req.body;

        if (!media?.length && !description) {
            return res.status(400).json({ success: false, message: "Either description or media is required." });
        }

        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, 
            { description, media, tag, endDate },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        return res.status(200).json({ success: true, post: updatedPost });
    } catch (error) {
        console.error("Error in updatePost:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const deletePost = async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.postId);
        if (!deletedPost) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }
        return res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error in deletePost:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
