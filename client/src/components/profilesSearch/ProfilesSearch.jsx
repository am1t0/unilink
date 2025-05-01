import React, { useEffect, useRef, useState } from "react";
import "./profilesSearch.css";
import { resolveAvatar } from "../../utilities/defaultImages";
import { useAuthStore } from "../../store/useAuthStore";
import { useMessageStore } from "../../store/useMessageStore";

export default function ProfilesSearch({setShow, show}) {

  // Importing the authUser and searchUsers from the auth store
  // and createConversation from the message store
  const { authUser, searchUsers } = useAuthStore();
  const { createConversation } = useMessageStore();

  // user search state variables
  const [users, setUsers] = useState(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  //component reference
  const boxRef = useRef();

  // Close the search box when clicked outside
  useEffect(()=> {
      
    // eslint-disable-next-line no-unused-vars
      const handleClickOutside = ( event )=>{
       if( boxRef.current && !boxRef.current.contains(event.target) ){
          setShow(!show)
       }
      }

       if(show) document.addEventListener("mousedown", handleClickOutside);

       return ()=> {
        document.removeEventListener("mousedown", handleClickOutside);
       }

  },[setShow, show]);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Search when debouncedQuery updates
  useEffect(() => {
    const fetch = async () => {
      if (!debouncedQuery) return;

      const result = await searchUsers(debouncedQuery);
      setUsers(result);
    };

    fetch();
  }, [debouncedQuery, searchUsers]);

  const handleConversationCreate = async (userId) => {
    // hide the search input box
    setShow(false);

    //create the conversation for the members
    const members = [userId, authUser._id];
    await createConversation(members);
  }
  
  return (
    <div className="user-search" ref={boxRef}>
      <div className="search-input">
        <input
          type="text"
          placeholder="New conversation"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
      </div>

      <ul className="search-results">
        {users?.map((u) => (
          <div 
             className="user-searched" 
             key={u._id} 
             onClick={() => handleConversationCreate(u._id)}
          >
            <img src={resolveAvatar(u)} alt="avatar" />
            <div className="users-info">
              <h3>{u.name}</h3>
              <p>{u.email}</p>
            </div>
          </div>
        ))}
        {
          users?.length === 0 && (
            <div className="no-users-found">
              <p>No users found</p>
            </div>
          )
        }
        {
          users === null && (
            <div className="no-users-found">
              <p>Enter email or name</p>
            </div>
          )
        }
      </ul>
    </div>
  );
}
