import { asyncHandler } from "../utilities/asyncHandler.js";
import Post from "../models/post.model.js";
import SavedPost from "../models/saved_post.model.js";
import mongoose from "mongoose";


export const toggleSave = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    // Validate postId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid post ID" 
        });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({ 
            success: false, 
            message: "Post not found" 
        });
    }

    // Find or create saved post document for user
    let savedPost = await SavedPost.findOne({ user: userId });

    // If user has saved posts, check if this post is already saved
    if (savedPost) {
        const postIndex = savedPost.post.indexOf(postId);

        if (postIndex !== -1) {
            // Remove post from saved list
            savedPost.post.splice(postIndex, 1);
            await savedPost.save();
            
            return res.status(200).json({ 
                success: true, 
                message: "Post unsaved",
                isSaved: false,
                savedPosts: savedPost.post
            });
        }
    }

    // If the user has no saved posts, create a new document
    if (!savedPost) {
        savedPost = new SavedPost({ 
            user: userId, 
            post: [postId] 
        });
    } else {
        // Add the post to the existing saved posts array
        savedPost.post.push(postId);
    }

    await savedPost.save();
    
    return res.status(200).json({ 
        success: true, 
        message: "Post saved",
        isSaved: true,
        savedPosts: savedPost.post
    });
});

/**
 * @desc Get all saved posts for a user
 * @route GET /api/v1/post-interaction/saved-posts
 * @access Private
 */
export const getSavedPosts = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 9;
    const skip = (page - 1) * limit;

    const savedPostsDoc = await SavedPost.findOne({ user: userId })
        .populate({
            path: 'post',
            populate: {
                path: 'user',
                select: 'name avatar position'
            }
        });

    if (!savedPostsDoc || !savedPostsDoc.post || savedPostsDoc.post.length === 0) {
        return res.status(200).json({
            success: true,
            savedPosts: []
        });
    }

    const total = savedPostsDoc.post.length;
    const paginatedPosts = savedPostsDoc.post.slice(skip, skip + limit);

    return res.status(200).json({
        success: true,
        savedPosts: paginatedPosts,
        total
    });
});


/**
 * @desc Check if a post is saved by user
 * @route GET /api/v1/post-interaction/is-saved/:postId
 * @access Private
 */
export const isPostSaved = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    // Validate postId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid post ID" 
        });
    }

    const savedPost = await SavedPost.findOne({ 
        user: userId,
        post: { $in: [postId] }
    });

    return res.status(200).json({
        success: true,
        isSaved: !!savedPost
    });
});
