import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useSavePostsStore = create((set, get) => ({
  savedPostIds: [],
  savedPosts: [],
  page: 1,
  hasMore: true,
  loading: false,

  // Toggle Save Post
  toggeleSavePost: async (postId) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post(`/saveposts/save/${postId}`);
      const { savedPosts: saved } = response.data;

      const ids = saved.map((post) =>
        typeof post === "string" ? post : post._id
      );

      set({ savedPostIds: ids, loading: false });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Cannot save post");
      set({ loading: false });
    }
  },

  // Reset before fresh load (e.g., on component mount)
  resetSavedPosts: () => set({ savedPosts: [], page: 1, hasMore: true }),

  // Paginated Fetch for Infinite Scroll
  getSavedPosts: async () => {
    const { page, savedPosts, hasMore, loading } = get();

    if (!hasMore || loading) return; // prevent double load or over-fetching

    set({ loading: true });

    try {
      const res = await axiosInstance.post("/saveposts/getsavedposts", {
        page,
        limit: 6,
      });

      const newPosts = res.data.savedPosts || [];

      const newIds = newPosts.map((post) =>
        typeof post === "string" ? post : post._id
      );

      set({
        savedPostIds: [...get().savedPostIds, ...newIds],
        savedPosts: [...savedPosts, ...newPosts],
        page: page + 1,
        hasMore: newPosts.length > 0,
      });
    } catch (error) {
      console.error("getSavedPosts error:", error);
      toast.error("Cannot fetch saved posts");
    } finally {
      set({ loading: false });
    }
  },
}));
