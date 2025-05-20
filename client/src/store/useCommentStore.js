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

  // Like or unlike a comment
  toggleCommentLike: async (commentId, userId) => {
  try {
    const response = await axiosInstance.put(`/post-interaction/like-comment/${commentId}`);
    const { liked } = response.data;

    set((state) => ({
      comments: state.comments.map((comment) => {
        // Handle main comments
        if (comment._id === commentId) {
          return {
            ...comment,
            likes: liked === -1 ? comment.likes + 1 : comment.likes - 1,
            likedBy: liked === -1
              ? [userId, ...comment.likedBy]
              : comment.likedBy.filter((id) => id !== userId),
          };
        }

        // Handle replies
        const updatedReplies = comment.replies?.map((reply) => {
          if (reply._id === commentId) {
            return {
              ...reply,
              likes: liked === -1 ? reply.likes + 1 : reply.likes - 1,
              likedBy: liked === -1
                ? [userId, ...reply.likedBy]
                : reply.likedBy.filter((id) => id !== userId),
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

    return response.data;
    
  } catch (error) {
    console.error("Error toggling comment like:", error);
    throw error;
  }
},

  // Clear all comments
  clearComments: () => set({ comments: [], replies: {} }),
}));
