import React from "react";
import "./notificationCard.css";
import { FaHeart, FaComment, FaLink, FaAt } from "react-icons/fa";

const iconMap = {
  Like: <FaHeart className="icon like" />,
  Comment: <FaComment className="icon comment" />,
  Link: <FaLink className="icon link" />,
  Mention: <FaAt className="icon mention" />,
};

const messageMap = {
  Like: "liked your post",
  Comment: "commented on your post",
  Link: "shared a link with you",
  Mention: "mentioned you in a post",
};

const NotificationCard = () => {
  const type = "Link"
  const sender = {
    name: "Amit Pandey"
  }

  return (
    <div className="notification-card">
      <div className="icon-container">{iconMap[type]}</div>
      <div className="content">
        <p className="message">
          <strong>{sender?.name || "Someone"}</strong> {messageMap[type]}
        </p>
        <p className="timestamp">{new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default NotificationCard;
