import { asyncHandler } from "../utilities/asyncHandler.js";
import Post from "../models/post.model.js";
import Comment from "../models/comments.model.js";
import SavedPost from "../models/saved_post.model.js";
import mongoose from "mongoose";
/**
 * @desc Like or unlike a post
 * @route PUT /api/v1/post-interaction/like/:postId
 * @access Private
 */
export const toggleLike = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ 
                success: false, 
                message: "Post not found" 
            });
        }

        const likedIndex = post.likedBy.indexOf(userId);
        
        //user has already liked the post

        if (likedIndex === -1) {
            // Like the post
            post.likedBy.push(userId);
            post.likeCount += 1;
        } else {
            // Unlike the post
            post.likedBy.splice(likedIndex, 1);
            post.likeCount -= 1;
        }

        await post.save();

        return res.status(200).json({ 
            success: true, 
            message: likedIndex === -1 ? "Post liked" : "Post unliked",
            likeCount: post.likeCount
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
       });
    }
});


/**
 * @desc Comment on a post
 * @route POST /api/v1/post-interaction/add-comment/:postId
 * @access Private
 */
export const addComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    //comment text and parent comment id
    const { text, parentId } = req.body;
    const userId = req.user.id;

    try {
          // empty comment text
        if (!text) {        
            return res.status(400).json({ 
                success: false, 
                message: "Comment text is required" 
            });
        }

        const post = await Post.findById(postId);

        //post not exists
        if (!post) {
            return res.status(404).json({ 
                success: false, 
                message: "Post not found"
             });
        }

        //if this comment is a child of another comment check for valid id of parent
        if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid parent comment ID" 
            });
        }

        const newComment = await Comment.create({
            postId,
            userId,
            text,
            parentId: parentId || null,
        });

         // Increase comment count of post
         await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

         // If it's a reply (child comment), increase repliesCount on the parent comment
        if (parentId) {
            await Comment.findByIdAndUpdate(parentId, { $inc: { repliesCount: 1 } });
        }

        return res.status(201).json({ 
            success: true, 
            message: "Comment added", 
            comment: newComment 
        });

    } catch (error) {
        console.error("Error in addComment:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
});



/**
 * @desc Comment fetch of a post
 * @route GET /api/v1/post-interaction/get-parent-comments/:postId
 * @access Private
 */
export const getParentComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { page = 1, limit = 5 } = req.query; // Default pagination

    try {
        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        // Convert page and limit to numbers
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        // Fetch parent comments (excluding replies)
        const parentComments = await Comment.find({ postId, parentId: null })
            .populate("userId", "name avatar") // Fetch user details (optional)
            .sort({ createdAt: -1 }) // Latest first
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        // Check if there are more comments after the current page
        const totalComments = await Comment.countDocuments({ postId, parentId: null });
        const hasMore = pageNumber * limitNumber < totalComments; // True if more pages exist

        return res.status(200).json({
            success: true,
            comments: parentComments,
            hasMore, // Indicates whether more comments are available
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});


/**
 * @desc Comment fetch of a post
 * @route GET /api/v1/post-interaction/child-comments/:parentId
 * @access Private
 */
export const getChildComments = asyncHandler(async (req, res) => {
    const { parentId } = req.params;

    const { page = 1, limit = 5 } = req.query; // Default pagination

    try {
        // Convert page and limit to numbers
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        // Fetch parent comments (excluding replies)
        const childComments = await Comment.find({parentId})
            .populate("userId", "name avatar") // Fetch user details (optional)
            .sort({ createdAt: -1 }) // Latest first
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        // Check if there are more comments after the current page
        const totalComments = await Comment.countDocuments({ parentId});
        const hasMore = pageNumber * limitNumber < totalComments; // True if more pages exist

        return res.status(200).json({
            success: true,
            comments: childComments,
            hasMore, // Indicates whether more comments are available
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});



/**
 * @desc Delete a comment
 * @route DELETE /api/v1/post-interaction/remove/:commentId
 * @access Private
 */
export const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        //owner can only delete his/her comments
        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ success: 
                false, 
                message: "Unauthorized" 
            });
        }

        const postId = comment.postId;
        let totalDeletedComments = 1; // Track number of deleted comments

        if (comment.parentId) {
            // If it's a child comment, decrease repliesCount of parent
            await Comment.findByIdAndUpdate(comment.parentId, { $inc: { repliesCount: -1 } });
        } else {
            // If it's a parent comment, delete all child comments
            const deletedChildren = await Comment.deleteMany({ parentId: commentId });
            totalDeletedComments += deletedChildren.deletedCount; // Track number of deleted child comments
        }

        // Delete the comment itself
        await Comment.findByIdAndDelete(commentId);

        // Decrease commentCount in the Post model
        await Post.findByIdAndUpdate(postId, { $inc: { commentCount: -totalDeletedComments } });

        return res.status(200).json({
            success: true,
            message: "Comment deleted",
            deletedCount: totalDeletedComments
        });

    } catch (error) {
        console.error("Error in deleteComment:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
});


/**
 * @desc Save or unsave a post
 * @route PUT /api/v1/post-interaction/save/:postId
 * @access Private
 */
export const toggleSave = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    try {
        let savedPost = await SavedPost.findOne({ user: userId });

        // If user has saved posts, check if this post is already saved
        if (savedPost) {
            const postIndex = savedPost.post.indexOf(postId);

            if (postIndex !== -1) {  //if post is already saved

                // Remove post from saved list
                savedPost.post.splice(postIndex, 1);

                // Otherwise, update the savedPost document
                await savedPost.save();

                return res.status(200).json({ 
                    success: true, 
                    message: "Post unsaved" 
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
        
        return res.status(201).json({ 
            success: true, 
            message: "Post saved" 
        });

    } catch (error) {
        console.error("Error in toggleSave:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
});

/**
 * @desc Share a post (increment share count)
 * @route POST /api/v1/post-interaction/:postId/share
 * @access Private
 */
export const sharePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    try {
        let post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        post.share += 1;
        await post.save();

        return res.status(200).json({ success: true, message: "Post shared successfully" });

    } catch (error) {
        console.error("Error in sharePost:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});
