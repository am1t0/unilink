import React, { useEffect, useState } from 'react';
import './chatList.css';
import { Link } from 'react-router';
import { useAuthStore } from '../../../store/useAuthStore'
import { useMessageStore } from '../../../store/useMessageStore';
import Loader from '../../loader/Loader';

export default function ChatList({ typingUsers }) {
   
    const { authUser } = useAuthStore();
    
    // All convos function and state
    const {getConversations, conversations, setCurrentConversation} = useMessageStore();


    useEffect(() => {
        getConversations();
    }, [getConversations]);


    // User with which chat is going on in each conversation
    const getOtherMember = (members) => {
        return members.find(member => member._id !== authUser?._id) || members[0];
    };

    return (
        <aside className="conversation">
            <div className='conversation-head'>
                <h1>Chats</h1>
                <div className="search-conversation">
                    <input type="text" placeholder="Search conversation" />
                </div>
            </div>

            {/* Show loader while loading */}
            {!conversations ? (
                <Loader/> 
            ) : (
                <ul className="conversation-list">
                    {conversations?.map((conversation) => {
                        const otherMember = getOtherMember(conversation.members);
                        const isTyping = typingUsers[conversation._id] === otherMember._id;

                        return (
                            <Link to={`/chats/${conversation._id}`} key={conversation._id}>

                                {/* setting the current conversation for the chat window */}
                                <li className="conversation-item" onClick={()=> setCurrentConversation(conversation)}>
                                    <div className="conversation-avatar">
                                        <img 
                                            src={otherMember.avatar || `https://api.dicebear.com/6.x/avataaars/svg?seed=${otherMember.name}`}
                                            alt={`${otherMember.name}'s avatar`}
                                            className="avatar-image"
                                        />
                                    </div>
                                    <div className="conversation-info">
                                        <h3>{otherMember.name}</h3>
                                        {isTyping ? (
                                            <p className="typing">
                                                typing
                                                <span className="list-typing-dots">
                                                    <span className="list-typing-dot"></span>
                                                    <span className="list-typing-dot"></span>
                                                    <span className="list-typing-dot"></span>
                                                </span>
                                            </p>
                                        ) : (
                                            <p>{conversation?.lastMessage?.text || 'No messages yet'}</p>
                                        )}
                                    </div>
                                </li>
                            </Link>
                        );
                    })}
                </ul>
            )}
        </aside>
    );
}
