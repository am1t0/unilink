import toast from 'react-hot-toast';
import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export const usePostStore = create((set, get) => ({
  posts: null,
  filteredPosts: null,
  loading: false,
  currentFilter: null,


  toggleFilter: (filterType) => {
    const { posts, currentFilter } = get();

    const newFilter = currentFilter === filterType ? null : filterType;

    set({ currentFilter: newFilter });

    if (!posts) return;

    if (!newFilter) {
      set({ filteredPosts: posts });
    } else {
      set({ filteredPosts: posts.filter(post => post.tag === newFilter) });
    }
  },

  createPost: async (postData) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post("/posts/create-post", postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const currentPosts = get().posts || [];
      const newPosts = [response.data.post, ...currentPosts];
      set({
        posts: newPosts,
        filteredPosts: get().currentFilter
          ? newPosts.filter(post => post.tag === get().currentFilter)
          : newPosts
      });

      toast.success("Post created successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Post could not be created");
    } finally {
      set({ loading: false });
    }
  },

  getAllPosts: async () => {
    try {
      const response = await axiosInstance.get("/posts/getAll-posts");
      set({
        posts: response.data.posts,
        filteredPosts: response.data.posts // Show all by default
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Can't Fetch Posts");
    }
  },

  likePost: async (postId, user) => {
    try {
      const response = await axiosInstance.put(`/post-interaction/like/${postId}`);
      const currentPosts = get().posts || [];
      const { liked } = response.data;
      const userId = user._id;

      const updatedPosts = currentPosts.map((post) => {
        if (post._id === postId) {
          const updatedLikeCount = liked === -1 ? post.likeCount + 1 : post.likeCount - 1;

          const updatedLikersArr = liked === -1
            ? [...post.likedBy, userId] // Add user ID
            : post.likedBy.filter(id => id !== userId); // Remove user ID

          return {
            ...post,
            likeCount: updatedLikeCount,
            likedBy: updatedLikersArr,
          };
        }
        return post;
      });

      set({
        posts: updatedPosts,
        filteredPosts: get().currentFilter
          ? updatedPosts.filter(post => post.tag === get().currentFilter)
          : updatedPosts
      });

      return response.data;

    } catch (error) {
      toast.error(error.response?.data?.message || "Post could not be liked");
    }
  }
}));