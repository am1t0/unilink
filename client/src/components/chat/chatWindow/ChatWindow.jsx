import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router';
import { BsCameraVideo, BsTelephone, BsThreeDotsVertical, BsSend, BsPaperclip, BsEmojiSmile } from 'react-icons/bs';
import './chatWindow.css';
import { useAuthStore } from '../../../store/useAuthStore.';
import { useSocket } from '../../../providers/Socket';

export default function ChatWindow() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, text: "Hey, how are you?", sender: "John Doe", time: "10:00 AM" },
        { id: 2, text: "I'm good, thanks! How about you?", sender: "Jane Doe", time: "10:02 AM" },
        { id: 3, text: "Great! Have you completed the assignment?", sender: "John Doe", time: "10:05 AM" }
    ]);
    const {authUser} = useAuthStore();
    const messagesEndRef = useRef(null);
    const currentUser = "John Doe"; // This should come from authentication
    const {conversationId} = useParams(); // get conversationId from the URL
    const {socket} = useSocket();
    
        useEffect(()=>{
           socket.emit("addUser", authUser._id);
           socket.on("getUsers", users=>{
              console.log(users);
           })
        },[authUser._id, socket])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(()=>{
      socket.on("getMessage", data=>{
            const newMessage = {
                id: messages.length + 1,
                text: data.text,
                sender: data.senderId,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, newMessage]);
      })
    },[messages, socket])

    const handleSendMessage = () => {
        try {
            //send message to socket server
            socket.emit("sendMessage", {
                senderId: authUser._id,
                receiverId: "67cef718b9b99b1485e1d3bc",
                text: message,
            });

            //dummy code to send message
            if (message.trim()) {
                const newMessage = {
                    id: messages.length + 1,
                    text: message,
                    sender: currentUser,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages([...messages, newMessage]);
                setMessage('');
            }
        } catch (error) {
            
            console.log(error);
        }
    };


    return (
        <div className='chat-window'>
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
                    <nav className='chat-window-head'>
                        <div className="chat-window-head-left">
                            <img src="https://api.dicebear.com/6.x/avataaars/svg?seed=John" alt=""/>
                            <h3>John Doe</h3>
                        </div>
                        <div className="chat-window-head-right">
                            <button className="icon-button"><BsCameraVideo /></button>
                            <button className="icon-button"><BsTelephone /></button>
                            <button className="icon-button"><BsThreeDotsVertical /></button> 
                        </div>
                    </nav>

                    <div className="messages-container">
                        {messages.map((msg) => (
                            <div 
                                key={msg.id} 
                                className={`message ${msg.sender === currentUser ? 'message-sent' : 'message-received'}`}
                            >
                                <div className="message-content">
                                    <p>{msg.text}</p>
                                    <span className="message-time">{msg.time}</span>
                                </div>
                            </div>
                        ))}
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
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                        </div>
                        <button 
                            className="send-button"
                            onClick={handleSendMessage}
                        >
                            <BsSend />
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
