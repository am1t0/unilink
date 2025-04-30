import React, { useEffect, useState } from "react";
import "./profilesSearch.css";
import { resolveAvatar } from "../../utilities/defaultImages";
import { useAuthStore } from "../../store/useAuthStore";

export default function ProfilesSearch() {
  const { searchUsers } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const conversationCreated = (user) => {
    // Function to handle conversation creation with the selected user
    console.log("Conversation created with:", user);
  }

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

  return (
    <div className="user-search">
      <div className="search-input">
        <input
          type="text"
          placeholder="new conversation"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
      </div>

      <ul className="search-results">
        {users.map((u) => (
          <div className="user-searched" key={u._id} onClick={() => conversationCreated(u)}>
            <img src={resolveAvatar(u)} alt="avatar" />
            <div className="users-info">
              <h3>{u.name}</h3>
              <p>{u.email}</p>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}
