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
  },

  sendRequest: async (receiver) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post(`/links/request/${receiver}`);
      set((state) => {
        const updatedLinks = [...(state.links || []), response.data.newRequest ];
        return { links: updatedLinks };
      });
      
      toast.success(response.data.message);
      return response.data.newRequest._id; // Return the linkId

    } catch (error) {
      toast.error(error.response?.data?.message || "Cannot send link request");
    } finally {
      set({ loading: false });
    }
  },






  // acceptOrRejectLinkRequest: async (sender, status) => {
  //   set({ loading: true });
  //   try {
  //     const response = await axiosInstance.post(`/links/:sender`, { status });
  //     set((state) => {
  //       const updatedLinks = state.links.map((link) =>
  //         link._id === linkId ? { ...link, status } : link
  //       );
  //       return { links: updatedLinks };
  //     });
  //     toast.success(response.data.message);
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Cannot update link request");
  //   } finally {
  //     set({ loading: false });
  //   }
  // },

}));
