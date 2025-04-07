import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useCommentStore = create((set) => ({
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
        comments: [...state.comments, response.data.comment],
      }));
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

  // Like or unlike a comment
  toggleCommentLike: async (commentId) => {
    try {
      const response = await axiosInstance.put(`/post-interaction/like-comment/${commentId}`);
      set((state) => ({
        comments: state.comments.map((comment) => {
          // Handle main comments
          if (comment._id === commentId) {
            return {
              ...comment,
              likes: response.data.likeCount || 0,
              likedBy: response.data.likedBy || []
            };
          }
          // Handle replies
          const updatedReplies = comment.replies?.map((reply) => {
            if (reply._id === commentId) {
              return {
                ...reply,
                likes: response.data.likeCount || 0,
                likedBy: response.data.likedBy || []
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
    } catch (error) {
      console.error("Error toggling comment like:", error);
      throw error;
    }
  },

  // Clear all comments
  clearComments: () => set({ comments: [], replies: {} }),
}));
