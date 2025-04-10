import React, { useState } from "react";
import {
  FaHeart,
  FaComment,
  FaAt,
  FaUserPlus,
} from "react-icons/fa";
import "./notifications.css";
import { useNotificationsStore } from "../../store/useNotifications";


const iconMap = {
  Like: <FaHeart className="icon like" />,
  Comment: <FaComment className="icon comment" />,
  Mention: <FaAt className="icon mention" />,
  Follow: <FaUserPlus className="icon follow" />,
};

export default function Notifications() {
  const [filter, setFilter] = useState("All");

  const { notifications } = useNotificationsStore();

  console.log(notifications)

  const handleAction = (id, action) => {
    alert(`${action} request from user with id ${id}`);
  };

  const filteredNotifications =
    filter === "All"
      ? notifications
      : notifications?.filter((n) => n.type === filter);

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Notifications</h2>
        <select
          className="filter-dropdown"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Like">Likes</option>
          <option value="Comment">Comments</option>
          <option value="Mention">Mentions</option>
          <option value="Follow">Follows</option>
        </select>
      </div>

      <div className="notifications-list">
        {filteredNotifications?.map((n) => (
          <div className="notification-item" key={n.id}>
            <div className="notification-left">
              {iconMap[n.type]}
              <div>
                <p>
                  <strong>{n.sender}</strong>{" "}
                  {n.type === "Like" && "liked your post"}
                  {n.type === "Comment" && "commented on your post"}
                  {n.type === "Mention" && "mentioned you"}
                  {n.type === "Follow" && "wants to follow you"}
                </p>
                <span className="notification-time">{n.time}</span>
              </div>
            </div>

            {n.type === "Follow" && (
              <div className="follow-actions">
                <button
                  className="accept-btn"
                  onClick={() => handleAction(n.id, "Accepted")}
                >
                  Accept
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleAction(n.id, "Rejected")}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredNotifications?.length === 0 && (
          <p className="no-notifications">No notifications to show.</p>
        )}
      </div>
    </div>
  );
}
