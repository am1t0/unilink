import { useEffect, useCallback, useState } from "react";
import { useSocket } from "../providers/Socket";
import { useMessageStore } from "../store/useMessageStore";
import { useAuthStore } from "../store/useAuthStore";
import { useParams } from "react-router";

const useChatSocket = ({ setIsTyping, setTypingUsers }) => {
  const { authUser } = useAuthStore();
  const { socket } = useSocket();
  const { currentConversation, updateMessage,  updateConversationLastMessageAndOrder } = useMessageStore();
  const { conversationId } = useParams();

  // Receive messages
  const handleGetMessage = useCallback(
    (data) => {

      //update the message list only if user in target conversation
      if (data.conversationId === currentConversation?._id) {
        updateMessage(data);
      }
      // Update the last message in the conversation list
       updateConversationLastMessageAndOrder(data);
    },
    [currentConversation?._id, updateConversationLastMessageAndOrder, updateMessage]
  );

  // Show typing status for both current chat window and chat list
  const handleTypingShow = useCallback(
    (data) => {
      const isCurrentChatTyping =
        data.senderId ===
          currentConversation?.members?.find((m) => m._id !== authUser?._id)
            ?._id &&
        data.receiverId === authUser?._id &&
        data.conversationId === conversationId;

      if (isCurrentChatTyping) {
        // Set typing status for the current conversation (chat window)
        setIsTyping(true);
        clearTimeout(window.typingTimeoutRef);
        window.typingTimeoutRef = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }

      // Set typing status for chat list conversation
      setTypingUsers((prev) => ({
        ...prev,
        [data.conversationId]: data.senderId,
      }));

      // Clear typing status in chat list after 2 seconds
      clearTimeout(window.typingListTimeoutRef?.[data.conversationId]);
      window.typingListTimeoutRef = {
        ...(window.typingListTimeoutRef || {}),
        [data.conversationId]: setTimeout(() => {
          setTypingUsers((prev) => ({
            ...prev,
            [data.conversationId]: null,
          }));
        }, 2000),
      };
    },
    [
      authUser?._id,
      conversationId,
      currentConversation?.members,
      setIsTyping,
      setTypingUsers,
    ]
  );

  // Add user to socket when component mounts
  useEffect(() => {
    socket.emit("addUser", authUser?._id);
  }, [authUser?._id, socket]);

  // Attach event listeners
  useEffect(() => {
    socket.on("getMessage", handleGetMessage);
    socket.on("senderTyping", handleTypingShow);

    return () => {
      socket.off("getMessage", handleGetMessage);
      socket.off("senderTyping", handleTypingShow);
    };
  }, [handleGetMessage, handleTypingShow, socket]);
};

export default useChatSocket;
