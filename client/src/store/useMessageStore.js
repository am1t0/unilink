import toast from 'react-hot-toast';
import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useMessageStore = create((set) => ({
  conversations: null,
  currentConversation: null,
  messages: null,
  loading: false,
  process: null,

  createConversation: async (members) => {
    set({ process: "Creating conversation..." });

    try {
      const response = await axiosInstance.post("/conversation/new", { members });
      const { existingConversation, newConversation } = response.data;

      if (existingConversation) {
        // Just select the existing one without adding
        set({ currentConversation: existingConversation });
        return true;
      }

      // Add new one and set it as current
      set((state) => ({
        conversations: [newConversation, ...(state.conversations || [])],
        currentConversation: newConversation,
      }));

      toast.success("Conversation created successfully!");
      return true;

    } catch (error) {
      toast.error(error.response?.data?.message || "Cannot create conversation");
    } finally {
      set({ process: null });
    }
  },

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
      set({ messages: response.data.messages });

    } catch (error) {
      toast.error(error.response?.data?.message || "Cannot fetch messages");
    } finally {
      set({ loading: false });
    }
  },

  // Send a new message
  sendMessage: async (messageData) => {
    try {
      const response = await axiosInstance.post(`/message/new`, messageData);
      const newMessage = response.data.newMessage;

      //update message list for current conversation
      set((state) => ({
        messages: [...(state.messages || []), newMessage]
      }));
       
      return newMessage;
    } catch (error) {
      toast.error(error.response?.data?.message || "Cannot send message");
      return null;
    }
  },

  //update the messages on recieving for current conversation
  updateMessage: (messageData) => {

    if (!messageData._id) return; // Ensure message has ID

    set((state) => ({
      messages: [...(state.messages || []), {
        _id: messageData._id,
        conversationId: messageData.conversationId,
        senderId: messageData.senderId,
        text: messageData.text,
        status: messageData.status,
        createdAt: messageData.createdAt
      }]
    }));

  },

  // Clear messages when leaving a conversation
  clearMessages: () => {
    set({ messages: null, currentConversation: null });
  },

  // Update message status
  updateMessageStatus: async (messageId, status) => {
    try {
      await axiosInstance.patch(`/message/status/${messageId}`, { status });
      set((state) => ({
        messages: state.messages?.map(msg =>
          msg._id === messageId ? { ...msg, status } : msg
        )
      }));
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  },

  // Update last message and order of convesation
  updateConversationLastMessageAndOrder: (data) => {
    // update the last message for current conversation and put it on first
    const { text, _id, createdAt, conversationId } = data;

    set((state) => {
      const existingConversations = state.conversations || [];

      // Find the conversation to update
      const oldConversation = existingConversations.find(
        (c) => c._id === conversationId
      );

      if (!oldConversation) return state; // just in case it's not found

      // Create the updated conversation
      const updatedConversation = {
        ...oldConversation,
        lastMessage: {
          text,
          _id,
          createdAt,
        },
      };

      // Filter out the old one and add the updated one at the top
      const filtered = existingConversations.filter(
        (c) => c._id !== conversationId
      );

      return {
        ...state,
        conversations: [updatedConversation, ...filtered],
      };
    });
  }
}));
