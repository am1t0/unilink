import toast from 'react-hot-toast';
import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useNotificationsStore = create((set) => ({
    notifications: null,
    show: false,
    loading: false,
    
    
    getNotifications: async () => {
        set({ loading: true });
        try {
        const response = await axiosInstance.get("/notification/all");
        console.log(response.data.notifications)
        set({ notifications: response.data.notifications });
        } catch (error) {
            console.log(error);
        toast.error(error.response?.data?.message || "Cannot fetch notifications");
        } finally {
        set({ loading: false });
        }
    },

    getNotification: async (notificationId) => {
        set({ loading: true });
        try {
            const response = await axiosInstance.get(`/notification/${notificationId}`);
            set((state) => {
                const existingNotifications = state.notifications || [];
                const newNotification = response.data.newNotification;
    
                // Check if the notification already exists
                const alreadyExists = existingNotifications.find(
                    (n) => n._id === newNotification._id
                );
    
                // If it exists, update it; otherwise, add it
                const updatedNotifications = alreadyExists
                    ? existingNotifications.map((n) =>
                        n._id === newNotification._id ? newNotification : n
                    )
                    : [newNotification, ...existingNotifications];
    
                return { notifications: updatedNotifications };
            });

            // If the notification is new, show the notification card
            set((state)=> ({
                show: true,
            }))

        } catch (error) {
            toast.error(error.response?.data?.message || "Cannot fetch notification");
        } finally {
            set({ loading: false });
        }
    },

    sendNotification: async (notification) => {
        set({ loading: true });
        try {
            const response = await axiosInstance.post("/notification/new", notification);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Cannot add notification");
        } finally {
            set({ loading: false });
        }
    },

    markAllNotificationRead: async()=>{
        set({ loading: true });
        try {
            await axiosInstance.patch("/notification/mark-all-read");
            set((state) => {
                const updatedNotifications = state.notifications.map((notification) => ({
                    ...notification,
                    status: 'read',
                }));
                return { notifications: updatedNotifications };
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Cannot mark all notifications as read");
        } finally {
            set({ loading: false });
        }
    },

    hide: () => set((state) => ({ show: false })),
}));