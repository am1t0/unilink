import toast from 'react-hot-toast';
import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export const usePostStore = create((set) => ({
  post: null,
  loading: false,

  createPost: async (postData) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post("/posts/create-post", postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ post: response.data });
      toast.success("Post created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Post could not be created");
    } finally {
      set({ loading: false });
    }
  },
}));
