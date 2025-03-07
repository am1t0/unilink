import React, { useState } from 'react'
import './chatList.css';

export default function ChatList() {
    
    const [conversations, setConversations] = useState([
        {
            id: 1,
            members: ['John Doe', 'Jane Doe'],
            lastMessage: 'Hello, how are you?'
        },
        {
            id: 2,
            members: ['Amit Pandey', 'Rahul Kumar'],
            lastMessage: 'Hello, how are you?'
        }
    ]); // list of conversations

  return (
    <aside className="conversation">
           <div className='conversation-head'>
               <h1>Chats</h1>
               <div className="search-conversation">
                     <input type="text" placeholder="Search conversation"/>
               </div>
           </div>
           <ul className="conversation-list">
              {
                conversations.map((conversation, index) => (
                    <li key={index} className="conversation-item">
                        <div className="conversation-info">
                            <h2>Conversation {index + 1}</h2>
                            <p>Members: {conversation.members.join(', ')}</p>
                        </div>
                    </li>
                ))
              }
           </ul>
       </aside>
  )
}
