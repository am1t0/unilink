import toast from 'react-hot-toast';
import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useNotificationsStore = create((set, get) => ({
    notifications: null,
    show: false,
    hasMore: true,
    process: null,
    loading: false,

    getNotifications: async () => {
        set({ process: "notifications-fetch" });

        const { notifications, hasMore } = get();
        if (!hasMore) return;

        let cursor = null;
        let _id = null;

        if (notifications && notifications.length > 0) {
            const last = notifications[notifications?.length - 1];
            cursor = last.createdAt;
            _id = last._id;
        }

        try {
            // Build query params only if they are valid
            const params = new URLSearchParams();
            if (cursor) params.append("cursor", cursor);
            if (_id) params.append("_id", _id);

            const response = await axiosInstance.get(`/notification/get?${params.toString()}`);
            const newNotifications = response.data.notifications || [];

            set((state) => {
                const existingIds = new Set(state.notifications?.map((n) => n._id) || []);
                const filteredNotifications = newNotifications.filter((n) => !existingIds.has(n._id));

                return {
                    notifications: [...(state.notifications || []), ...filteredNotifications],
                    hasMore: response.data.hasMore, // Use the `hasMore` field from the backend
                    process: null,
                };
            });

        } catch (error) {
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
            set((state) => ({
                show: true,
            }))

        } catch (error) {
            toast.error(error.response?.data?.message || "Cannot fetch notification");
        } finally {
            set({ loading: false });
        }
    },

    prepareNotification: async (notification) => {
        set({ loading: true });
        try {
            const notificationId = notification.notificationId;
            const response = await axiosInstance.post("/notification/new", notification);
           if( notification.type === "Link-Accepted") {
            //update type of the notification
            set((state) => ({
                notifications: state.notifications?.map((notif)=> 
                 notif._id === notificationId 
                 ? { ...notif, type:"Link-Accepted"}
                 : notif
                )
            }))
        }
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Cannot add notification");
        } finally {
            set({ loading: false });
        }
    },

    markAllNotificationRead: async () => {
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

    sendMail: async (mailData) => {
        set({ loading: true });
        try {
            if (mailData.type === "Link") {
                mailData.type = "follow-req"
            }
            // similarly for other types ....

            const response = await axiosInstance.post("/mail/send", mailData);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Cannot send email");
        } finally {
            set({ loading: false });
        }
    },

    updateNotificationType: async (notificationId, type) => {
        try {
            const response = await axiosInstance.patch(`/notification/type/${notificationId}`, { type });
            set((state) => ({
                notifications: state.notifications.map((notification) =>
                    notification._id === notificationId
                        ? { ...notification, type }
                        : notification
                ),
            }));
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Cannot update notification");
        } finally {
             
        }
    },

    hide: () => set((state) => ({ show: false })),
}));