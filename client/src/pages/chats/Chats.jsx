import React, {useEffect, useState} from 'react'
import './chats.css';
import ChatList from '../../components/chat/chatList/ChatList';
import ChatWindow from '../../components/chat/chatWindow/ChatWindow';
import useChatSocket from '../../hooks/useChatSocket';
import Overlay from '../../components/overlay/Overlay';
import { useMessageStore } from '../../store/useMessageStore';

export default function Chats() {

  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});

  const { process } = useMessageStore();

  useChatSocket({ setIsTyping, setTypingUsers });

  return (
    <div className='chats-page'>
      
      {
        process && <Overlay message = {process} />
      }
      <ChatList typingUsers = { typingUsers}/>

      <ChatWindow  isTyping={ isTyping }/>
    
    </div>
  )
}
