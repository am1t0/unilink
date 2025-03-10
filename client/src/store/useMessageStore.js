import toast from 'react-hot-toast';
import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useMessageStore = create((set) => ({
  conversations: null,
  currentConversation: null,
  messages: null,
  loading: false,

  // Get all conversations for current user
  getConversations: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/conversation/all");
      set({ conversations: response.data.conversations });
    } catch (error) {
      toast.error(error.response?.data?.message || "Cannot fetch conversations");
    } finally {
      set({ loading: false });
    }
  },

  // Get messages for a specific conversation
  getMessages: async (conversationId) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(`/messages/${conversationId}`);
      set({ 
        messages: response.data.messages,
        currentConversation: response.data.conversation 
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Cannot fetch messages");
    } finally {
      set({ loading: false });
    }
  },

  // Send a new message
  sendMessage: async (conversationId, text) => {
    try {
      const response = await axiosInstance.post(`/messages/${conversationId}`, { text });
      set((state) => ({ 
        messages: [...state.messages, response.data.message]
      }));
      return response.data.message;
    } catch (error) {
      toast.error(error.response?.data?.message || "Cannot send message");
      return null;
    }
  },

  // Clear messages when leaving a conversation
  clearMessages: () => {
    set({ messages: null, currentConversation: null });
  }
}));
