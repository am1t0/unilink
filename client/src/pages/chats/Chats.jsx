import React, {useState} from 'react'
import { useParams } from 'react-router';
import './chats.css';
import ChatList from '../../components/chat/chatList/ChatList';
import ChatWindow from '../../components/chat/chatWindow/ChatWindow';

export default function Chats() {
  
    const [messages, setMessages] = useState([]); // list of messages

    const {conversationId} = useParams(); // get conversationId from the URL

  return (
    <div className='chats-page'>
      
      <ChatList/>

      <ChatWindow/>
      
    </div>
  )
}
