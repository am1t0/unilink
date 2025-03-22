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

  //set current conversation
  setCurrentConversation: (conversation) => {
    set({ currentConversation: conversation });
  },

  // Get messages for a specific conversation
  getMessages: async (conversationId) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(`/message/all/${conversationId}`);
      set({messages: response.data.messages});

    } catch (error) {
      toast.error(error.response?.data?.message || "Cannot fetch messages");
    } finally {
      set({ loading: false });
    }
  },

  // Send a new message
  sendMessage: async (messageData) => {
    try {
      const response = await axiosInstance.post(`/message/new`, messageData );
      set((state) => ({ 
        messages: [...state.messages, { ...response.data.newMessage, status: 'sent' }]
      }));
      return response.data.message;
    } catch (error) {
      toast.error(error.response?.data?.message || "Cannot send message");
      return null;
    }
  },

  //update the messages on recieving for current conversation
  updateMessage: async (messageData) => {
    set((state) => ({ messages: [...state.messages, messageData] }));
  },

  // Update message status
  updateMessageStatus: (messageId, status) => {
    set((state) => ({
      messages: state.messages.map(msg => 
        msg._id === messageId ? { ...msg, status } : msg
      )
    }));
  },

  // Clear messages when leaving a conversation
  clearMessages: () => {
    set({ messages: null, currentConversation: null });
  }
}));
