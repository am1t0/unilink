import React, { useEffect, useState } from "react";
import "./notificationCard.css";
import { FaHeart, FaComment, FaLink, FaAt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNotificationsStore } from "../../store/useNotifications";
import notificationSound from "../../assets/sounds/notification.mp3";

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

const NotificationCard = ({ type = "Link", sender = { name: "Amit Pandey" }, onClose }) => {
  
  const { show, hide } = useNotificationsStore();
  const audio = React.useMemo(() => new Audio(notificationSound), []);

  useEffect(() => {
    if (!show) return;

    // Play the notification sound when the component is shown
    audio.play().catch((error) => {
      console.error("Failed to play notification sound:", error);
    });

    const timer = setTimeout(() => {
      hide();
    }, 4000);

    return () => clearTimeout(timer);
  }, [hide, show, audio]);

  if (!show) return null;

  return (
    <Link
      to={`/notifications?type=${type}`}
      className="notification-toast"
    >
      <div className="icon-container">
        {iconMap[type]}
      </div>
      <div className="content">
        <p className="message">
          <strong>{sender?.name || "Someone"}</strong> {messageMap[type]}
        </p>
        <p className="timestamp">{new Date().toLocaleTimeString()}</p>
      </div>
      <span className="tag">{type}</span>
    </Link>
  );
};

export default NotificationCard;
