import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router';
import './chats.css';
import ChatList from '../../components/chat/chatList/ChatList';
import ChatWindow from '../../components/chat/chatWindow/ChatWindow';

export default function Chats() {

  return (
    <div className='chats-page'>
      
      <ChatList/>

      <ChatWindow/>
      
    </div>
  )
}
