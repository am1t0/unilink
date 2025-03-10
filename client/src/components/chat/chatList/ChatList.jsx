import React, { useEffect } from 'react'
import './chatList.css';
import { Link } from 'react-router';
import { useAuthStore } from '../../../store/useAuthStore.';
import { useMessageStore } from '../../../store/useMessageStore';

export default function ChatList() {
   
    const { authUser } = useAuthStore();
    const { getConversations, conversations } = useMessageStore();

    useEffect(() => {
        getConversations();
    },[]);

    const getOtherMember = (members) => {
        return members.find(member => member._id !== authUser?._id) || members[0];
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
                conversations?.map((conversation) => {
                    const otherMember = getOtherMember(conversation.members);
                    return (
                        <Link to={`/chats/${conversation._id}`} key={conversation._id}>
                            <li className="conversation-item">
                                <div className="conversation-avatar">
                                    <img 
                                        src={otherMember.avatar || `https://api.dicebear.com/6.x/avataaars/svg?seed=${otherMember.name}`}
                                        alt={`${otherMember.name}'s avatar`}
                                        className="avatar-image"
                                    />
                                </div>
                                <div className="conversation-info">
                                    <h3>{otherMember.name}</h3>
                                    <p>{conversation.lastMessage || 'No messages yet'}</p>
                                </div>
                            </li>
                        </Link>
                    )
                })
              }
           </ul>
       </aside>
    )
}
