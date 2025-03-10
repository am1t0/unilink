import toast from 'react-hot-toast';
import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export const usePostStore = create((set) => ({
  posts: null,
  loading: false,

  createPost: async (postData) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post("/posts/create-post", postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({ posts: [...state.posts || [], response.data.post] }));
      toast.success("Post created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Post could not be created");
    } finally {
      set({ loading: false });
    }
  },

  getAllPosts : async () => {
    try {
      const response = await axiosInstance.get("/posts/getAll-posts");

      set({ posts: response.data.posts });
    } catch (error) {
      
      toast.error(error.response?.data?.message || "Cant Fetch Posts");
    }
  }
}));
