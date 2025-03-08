import React, { useState } from 'react'
import './chatList.css';
import { Link } from 'react-router';

export default function ChatList() {
    const currentUser = 'John Doe'; // This should come from authentication later
    
    const [conversations, setConversations] = useState([
        {
            id: 1,
            members: ['John Doe', 'Jane Doe'],
            lastMessage: 'Hello, how are you?',
            avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Jane'
        },
        {
            id: 2,
            members: ['John Doe', 'Rahul Kumar'],
            lastMessage: 'Can you help me with the project?',
            avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Rahul'
        },
        {
            id: 3,
            members: ['John Doe', 'Sarah Wilson'],
            lastMessage: 'The meeting is at 3 PM tomorrow',
            avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Sarah'
        },
        {
            id: 4,
            members: ['John Doe', 'Mike Chen'],
            lastMessage: 'Thanks for your help!',
            avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Mike'
        },
        {
            id: 5,
            members: ['John Doe', 'Emily Brown'],
            lastMessage: 'Did you check the latest updates?',
            avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Emily'
        },
        {
            id: 6,
            members: ['John Doe', 'Alex Martinez'],
            lastMessage: 'See you at the library',
            avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Alex'
        }
    ]);

    const getOtherMemberName = (members) => {
        return members.find(member => member !== currentUser) || members[0];
    };

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
                    <Link to={`/chats/${conversation.id}`}>
                    <li key={index} className="conversation-item">
                        <div className="conversation-avatar">
                            <img 
                                src={conversation.avatar} 
                                alt={`${getOtherMemberName(conversation.members)}'s avatar`}
                                className="avatar-image"
                                />
                        </div>
                        <div className="conversation-info">
                            <h3>{getOtherMemberName(conversation.members)}</h3>
                            <p>{conversation.lastMessage}</p>
                        </div>
                    </li>
                    </Link>
                ))
              }
           </ul>
       </aside>
    )
}
