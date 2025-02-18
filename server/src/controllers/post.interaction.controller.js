import { asyncHandler } from "../utilities/asyncHandler.js";
import Post from "../models/post.model.js";
import Comment from "../models/comments.model.js";
import SavedPost from "../models/saved_post.model.js";
/**
 * @desc Like or unlike a post
 * @route PUT /api/v1/post-interaction/:postId/like
 * @access Private
 */
export const likePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    try {
        let post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const isLiked = post.likedBy.includes(userId);

        if (isLiked) {
            // Unlike the post
            post.likedBy = post.likedBy.filter(id => id.toString() !== userId);
        } else {
            // Like the post
            post.likedBy.push(userId);
        }

        await post.save();

        return res.status(200).json({
            success: true,
            message: isLiked ? "Post unliked" : "Post liked",
        });

    } catch (error) {
        console.error("Error in likePost:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

/**
 * @desc Comment on a post
 * @route POST /api/v1/post-interaction/:postId/comment
 * @access Private
 */
export const addComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { text, parentId } = req.body;
    const userId = req.user.id;

    try {
        if (!text) {
            return res.status(400).json({ success: false, message: "Comment text is required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
            return res.status(400).json({ success: false, message: "Invalid parent comment ID" });
        }

        const newComment = await Comment.create({
            postId,
            userId,
            text,
            parentId: parentId || null,
        });

        return res.status(201).json({ success: true, message: "Comment added", comment: newComment });

    } catch (error) {
        console.error("Error in addComment:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

/**
 * @desc Delete a comment
 * @route DELETE /api/v1/post-interaction/:postId/comment/:commentId
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

        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        await Comment.findByIdAndDelete(commentId);
        return res.status(200).json({ success: true, message: "Comment deleted" });

    } catch (error) {
        console.error("Error in deleteComment:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
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
