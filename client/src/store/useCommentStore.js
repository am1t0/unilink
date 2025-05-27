import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useCommentStore = create((set, get) => ({
  comments: [], // Stores all parent comments
  loading: false, // Indicates if comments are being fetched
  error: null, // Stores any error that occurs during fetching

  // Fetch parent comments for a post
  fetchComments: async (postId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/post-interaction/comments/${postId}`
      );
      const structuredComments = response.data.comments.map((comment) => ({
        ...comment,
        replies: comment.replies || [], // Ensure replies are an array
      }));
      set({ comments: structuredComments, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Add a new comment
  addComment: async (postId, text, parentId = null) => {
    try {
      const response = await axiosInstance.post(
        `/post-interaction/add-comment/${postId}`,
        { text, parentId }
      );
      set((state) => ({
        comments: [response.data.comment, ...state.comments],
      }));

      return response.data;

    } catch (error) {
      console.error("Error adding comment:", error);
    }
  },

  // Remove a comment
  removeComment: async (commentId) => {
    try {
      await axiosInstance.delete(`/post-interaction/remove/${commentId}`);
      set((state) => ({
        comments: state.comments.filter((comment) => comment.id !== commentId),
      }));
    } catch (error) {
      console.error("Error removing comment:", error);
    }
  },

  // Utility to update like count and likedBy array for a comment or reply
  updateCommentLikeCount: (data) => {
    let { commentId, userId, liked } = data;
    let { type, sender } = data; // in case of this function usage through notification

    if (type === "Comment-Like") liked = -1; 
    if (sender) userId = sender; 

    set((state) => ({
      comments: state.comments.map((comment) => {
        // Handle main comments
        if (comment._id === commentId) {
          let updatedLikes = comment.likes;
          let updatedLikersArr = comment.likedBy;
          if (liked === -1) {
            if (!comment.likedBy.includes(userId)) {
              updatedLikes = comment.likes + 1;
              updatedLikersArr = [userId, ...comment.likedBy];
            }
          } else {
            if (comment.likedBy.includes(userId)) {
              updatedLikes = comment.likes - 1;
              updatedLikersArr = comment.likedBy.filter((id) => String(id) !== String(userId));
            }
          }
          return {
            ...comment,
            likes: updatedLikes,
            likedBy: updatedLikersArr,
          };
        }
        // Handle replies
        const updatedReplies = comment.replies?.map((reply) => {
          if (reply._id === commentId) {
            let updatedLikes = reply.likes;
            let updatedLikersArr = reply.likedBy;
            if (liked === -1) {
              if (!reply.likedBy.includes(userId)) {
                updatedLikes = reply.likes + 1;
                updatedLikersArr = [userId, ...reply.likedBy];
              }
            } else if (liked === 1) {
              if (reply.likedBy.includes(userId)) {
                updatedLikes = reply.likes - 1;
                updatedLikersArr = reply.likedBy.filter((id) => String(id) !== String(userId));
              }
            }
            return {
              ...reply,
              likes: updatedLikes,
              likedBy: updatedLikersArr,
            };
          }
          return reply;
        });
        if (updatedReplies) {
          return {
            ...comment,
            replies: updatedReplies,
          };
        }
        return comment;
      }),
    }));
  },

  // Like or unlike a comment
  toggleCommentLike: async (commentId, userId) => {
    try {
      const response = await axiosInstance.put(`/post-interaction/like-comment/${commentId}`);
      const { liked } = response.data;
      // Use the utility to update state
      get().updateCommentLikeCount({commentId, userId, liked});
      return response.data;
    } catch (error) {
      console.error("Error toggling comment like:", error);
      throw error;
    }
  },

  // Clear all comments
  clearComments: () => set({ comments: [], replies: {} }),
}));
