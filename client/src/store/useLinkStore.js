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

  getUserRecommendations: async () => {
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

    try {
      const response = await axiosInstance.post(`/links/request/${receiver}`);
      const newRequest = response.data.newRequest;

      set((state) => {
        const updatedRecommendations = (state.recommendations || []).map((rec) => {
          if (rec._id === receiver) {
            return { ...rec, status: "Requested" };
          }
          return rec;
        });

        return {
          recommendations: updatedRecommendations,
          links: [...(state.links || []), newRequest],
        };
      });
      return newRequest._id; // Return the linkId
    } catch (error) {
      toast.error(error.response?.data?.message || "Cannot send link request");
    } 
  },


  changeLinkStatus: async (linkId, status) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.patch(`/links/${linkId}`, { status });
      // set((state) => {
      //   const updatedLinks = state.links.map((link) =>
      //     link._id === linkId ? { ...link, status } : link
      //   );
      //   return { links: updatedLinks };
      // });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Cannot update link request");
    } finally {
      set({ loading: false });
    }
  },

}));
