import React, { useCallback, useEffect, useState } from "react";
import "./chatList.css";
import { Link } from "react-router";
import { useAuthStore } from "../../../store/useAuthStore";
import { useMessageStore } from "../../../store/useMessageStore";
import Loader from "../../loader/Loader";
import { Bs0Circle, BsLamp, BsPencil, BsPencilSquare } from "react-icons/bs";
import ProfilesSearch from "../../profilesSearch/ProfilesSearch";

export default function ChatList({ typingUsers }) {
  const { authUser } = useAuthStore();

  // All convos function and state
  const {
    getConversations,
    conversations,
    setCurrentConversation,
    currentConversation,
  } = useMessageStore();

  const [filteredChats, setFilteredChats] = useState([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showProfileSearch, setShowProfileSearch] = useState(false);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    getConversations();
  }, [getConversations]);

  // User with which chat is going on in each conversation
  const getOtherMember = useCallback(
    (members) => {
      return (
        members.find((member) => member._id !== authUser?._id) || members[0]
      );
    },
    [authUser]
  );

  // Filter conversations when conversations or debouncedQuery changes
  useEffect(() => {
    if (!conversations) return;

    if (debouncedQuery.trim() === "") {
      setFilteredChats(conversations);
    } else {
      const lowerCaseQuery = debouncedQuery.toLowerCase();
      const matched = conversations.filter((conversation) => {
        const otherMember = getOtherMember(conversation.members);
        return otherMember?.name.toLowerCase().includes(lowerCaseQuery);
      });
      setFilteredChats(matched);
    }
  }, [conversations, debouncedQuery, getOtherMember]);

  return (
    <aside className="conversation">
      <div className="conversation-head">
        <div className="head-bar">
          <h1>Chats</h1>
          <div className="head-bar-right">
            <button className="icon-button" onClick={()=> setShowProfileSearch(!showProfileSearch)}>
              <BsPencil/>
            </button>
            <button className="icon-button">
              <BsLamp/>
            </button>
          </div>
        </div>
        
        {
           showProfileSearch && <ProfilesSearch setShow = {setShowProfileSearch} />
        }
        <div className="search-conversation">
          <input
            type="text"
            placeholder="Search conversation"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Show loader while loading */}
      { !conversations ? (
        <Loader />
      ) : (
        <ul className="conversation-list">

          { ( query.length > 0 ? filteredChats : conversations )?.map((conversation) => {
            const otherMember = getOtherMember(conversation.members);
            const isTyping = typingUsers[conversation._id] === otherMember._id;
            return (
              // Setting the current conversation for the chat window
              <li
                id={`${
                  conversation._id === currentConversation?._id
                    ? "active-conversation"
                    : ""
                }`}
                className="conversation-item"
                key={conversation._id}
                onClick={() => setCurrentConversation(conversation)} // Pass conversation ID correctly
              >
                <div className="conversation-avatar">
                  <img
                    src={
                      otherMember.avatar ||
                      `https://api.dicebear.com/6.x/avataaars/svg?seed=${otherMember.name}`
                    }
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
                    <p>
                      {conversation?.lastMessage?.text || "No messages yet"}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
          
         
          <div className="no-conversation">
             <h3>
             { (conversations.length === 0) && "Start a conversation" }

             { (filteredChats.length === 0 && query.length > 0 ) &&  "No match found"}
             </h3>
          </div>

        </ul>
      )}
    </aside>
  );
}
