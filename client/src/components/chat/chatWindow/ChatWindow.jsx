import React, { useEffect, useState, useRef } from "react";
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
import { useMessageStore } from "../../../store/useMessageStore";
import { useSocket } from "../../../providers/Socket";
import EmojiPicker from "../../emojiPicker/EmojiPicker";

export default function ChatWindow({ isTyping }) {

  // State Management
  const { currentConversation, getMessages, messages, sendMessage } =
    useMessageStore();
  const { authUser } = useAuthStore();
  const { socket } = useSocket();

  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);

  // Computed Values
const otherMember =
  currentConversation?.members.find((member) => member._id !== authUser?._id) ||
  currentConversation?.members[0];

const conversationId = currentConversation?._id;

  // Message Handlers
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    if (e.target.value.trim()) {
      socket.emit("typing", {
        senderId: authUser?._id,
        receiverId: otherMember?._id,
        conversationId: currentConversation?._id,
      });
    }
  };

const handleMessageSend = async () => {
    if (!message.trim()) return;

    try {
      const messageData = {
        senderId: authUser._id,
        receiverId: otherMember._id,
        text: message,
        conversationId: conversationId,
        createdAt: new Date().toISOString(),
      };

      const { status, _id} = await sendMessage(messageData);
      
      //update the message data 
        messageData.status = status;
        messageData._id = _id;

      //send the message to the socket
      await socket.emit("sendMessage", messageData);

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Fetch messages on conversation change
  useEffect(() => {
    if (conversationId) getMessages(conversationId);
  }, [conversationId, getMessages]);

  // Scroll to the bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window">
      {!conversationId ? (
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
                alt="User"
              />
              <h3>{otherMember?.name}</h3>
              {isTyping && (
                <div className="user-typing-status">
                  typing
                  <span className="typing-dots">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </span>
                </div>
              )}
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
              const messageTime = new Date(msg?.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });

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
                    <div className="message-info">
                      <span className="message-time">{messageTime}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {showEmojiPicker && <EmojiPicker message={message} setMessage={setMessage} />}

          <div className="message-input-container">
            <button className="message-option-button">
              <BsPaperclip />
            </button>
            <button
              className="message-option-button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <BsEmojiSmile />
            </button>

            <div className="message-input-wrapper">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={handleMessageChange}
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
