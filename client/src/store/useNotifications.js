import toast from 'react-hot-toast';
import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useNotificationsStore = create((set) => ({
    notifications: null,
    loading: false,
    
    getNotifications: async () => {
        set({ loading: true });
        try {
        const response = await axiosInstance.get("/notifications/all-notifications");
        set({ notifications: response.data.notifications });
        } catch (error) {
        toast.error(error.response?.data?.message || "Cannot fetch notifications");
        } finally {
        set({ loading: false });
        }
    },

    addNotification: async (notification) => {
        set({ loading: true });
        try {
            const response = await axiosInstance.post("/notifications/add-notification", notification);
            set((state) => ({ notifications: [...state.notifications, response.data.notification] }));
            toast.success("Notification added successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Cannot add notification");
        } finally {
            set({ loading: false });
        }
    },

}));