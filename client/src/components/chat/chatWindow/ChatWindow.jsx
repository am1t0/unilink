import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router";
import {
  BsCameraVideo,
  BsTelephone,
  BsThreeDotsVertical,
  BsSend,
  BsPaperclip,
  BsEmojiSmile,
} from "react-icons/bs";
import "./chatWindow.css";
import { useAuthStore } from "../../../store/useAuthStore";
import { useSocket } from "../../../providers/Socket";
import { useMessageStore } from "../../../store/useMessageStore";

export default function ChatWindow() {
  //current convo , convo messages and state
  const {
    currentConversation,
    getMessages,
    messages,
    sendMessage,
    updateMessage,
  } = useMessageStore();

  //current user
  const { authUser } = useAuthStore();

  // get conversationId from the URL (router)
  const { conversationId } = useParams();

  //user socket
  const { socket } = useSocket();

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const otherMember =
    currentConversation?.members.find(
      (member) => member._id !== authUser?._id
    ) || currentConversation?.members[0];

  //fetch the current conversation messages
  useEffect(() => {
    if (conversationId) getMessages(conversationId);
  }, [conversationId, getMessages]);


  //add user to socket server
  useEffect(() => {
    socket.emit("addUser", authUser._id);
    socket.on("getUsers", (users) => {
      //   console.log(users);
    });
  }, [authUser._id, socket]);

  //scroll to bottom of the chat window
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMessageSend = async () => {
    try {
      const messageData = {
        sender: authUser._id,
        receiverId: otherMember._id,
        text: message,
        conversationId: conversationId,
        createdAt: new Date().toISOString(), // Add createdAt timestamp
      };

      await socket.emit("sendMessage", messageData);

      await sendMessage(messageData);
      setMessage(""); //clear the input field
    } catch (error) {
      console.log(error);
    }
  };

   // Use useCallback to memoize the handleGetMessage function
   const handleGetMessage = useCallback(
    (data) => {
      if (data.conversationId === currentConversation?._id) {
        updateMessage(data);
      }
    },
    [currentConversation?._id, updateMessage]
  );

  useEffect(() => {
    // Add event listener
    socket.on("getMessage", handleGetMessage);

    // Cleanup function to remove listener when component unmounts or conversation changes
    return () => {
      socket.off("getMessage", handleGetMessage);
    };
  }, [handleGetMessage, socket]);


  return (
    <div className="chat-window">
      {!conversationId ? ( // no conversation selected
        <div className="welcome-chat">
          <img
            src="https://api.dicebear.com/6.x/avataaars/svg?seed=chat"
            alt="Welcome"
          />
          <h2>Welcome to UniLink Chat</h2>
          <p>Select a conversation to start messaging</p>
        </div>
      ) : (
        <>
          <nav className="chat-window-head">
            <div className="chat-window-head-left">
              <img
                src={
                  otherMember?.avatar ||
                  `https://api.dicebear.com/6.x/avataaars/svg?seed=${otherMember?.name}`
                }
                alt=""
              />
              <h3>{otherMember?.name}</h3>
            </div>
            <div className="chat-window-head-right">
              <button className="icon-button">
                <BsCameraVideo />
              </button>
              <button className="icon-button">
                <BsTelephone />
              </button>
              <button className="icon-button">
                <BsThreeDotsVertical />
              </button>
            </div>
          </nav>

          <div className="messages-container">
            {messages?.map((msg) => {
              // Format the createdAt timestamp
              const messageTime = new Date(msg?.createdAt).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true, // For AM/PM format
                }
              );

              return (
                <div
                  key={msg?._id}
                  className={`message ${
                    msg?.sender === authUser?._id
                      ? "message-sent"
                      : "message-received"
                  }`}
                >
                  <div className="message-content">
                    <p>{msg?.text}</p>
                    <span className="message-time">{messageTime}</span>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          <div className="message-input-container">
            <button className="message-option-button">
              <BsPaperclip />
            </button>

            <div className="message-input-wrapper">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleMessageSend();
                }}
              />
            </div>
            <button className="send-button" onClick={handleMessageSend}>
              <BsSend />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
