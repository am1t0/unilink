import React, {useEffect, useState} from 'react'
import './chats.css';
import ChatList from '../../components/chat/chatList/ChatList';
import ChatWindow from '../../components/chat/chatWindow/ChatWindow';
import useChatSocket from '../../hooks/useChatSocket';

export default function Chats() {

  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});

  useChatSocket({ setIsTyping, setTypingUsers });

  return (
    <div className='chats-page'>
      
      <ChatList typingUsers = { typingUsers}/>

      <ChatWindow  isTyping={ isTyping }/>
      
    </div>
  )
}
