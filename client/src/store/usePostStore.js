import toast from 'react-hot-toast';
import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export const usePostStore = create((set, get) => ({
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
<<<<<<< HEAD
      const currentPosts = get().posts || [];
      set({ posts: [response.data.post, ...currentPosts] });
=======
      set((state) => ({ posts: [...state.posts || [], response.data.post] }));
>>>>>>> 0f64d3811142c9813acbf2e2e4a4a22c811589b7
      toast.success("Post created successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Post could not be created");
    } finally {
      set({ loading: false });
    }
  },

  getAllPosts : async () => {
    try {
      const response = await axiosInstance.get("/posts/getAll-posts");
<<<<<<< HEAD
=======

>>>>>>> 0f64d3811142c9813acbf2e2e4a4a22c811589b7
      set({ posts: response.data.posts });
    } catch (error) {
      
      toast.error(error.response?.data?.message || "Cant Fetch Posts");
    }
  },

  likePost: async (postId) => {
    try {
      const response = await axiosInstance.put(`/post-interaction/like/${postId}`);
      const currentPosts = get().posts || [];
      set({ posts: currentPosts.map((post) => (post.id === postId ? response.data.post : post)) });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Post could not be liked");
    }
  }
}));
