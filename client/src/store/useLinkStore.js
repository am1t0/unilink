import toast from 'react-hot-toast';
import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useLinkStore = create((set) => ({
  links: null,
  recommendations: null,
  loading: false,


  getLinks: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/links/all-links");
      set({ links: response.data.links });
    } catch (error) {
      toast.error(error.response?.data?.message || "Cannot fetch links");
    } finally {
      set({ loading: false });
    }
  },

  getUserRecommendations: async ()=>{
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/links/recommendations");
      set({ recommendations: response.data.links });
    } catch (error) {
      toast.error(error.response?.data?.message || "Cannot fetch recommendations");
    } finally {
      set({ loading: false });
    }
  }
}));
