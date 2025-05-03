import React, { useEffect, useState } from "react";
import "./list.css";
import { useNotificationsStore } from "../../../store/useNotifications";
import { useLinkStore } from "../../../store/useLinkStore";
import { useSocket } from "../../../providers/Socket";
import toast from "react-hot-toast";
import { resolveAvatar } from "../../../utilities/defaultImages";
import { getTimeAgo } from "../../../utilities/timeAndDate";

export default function List() {
  // Filter state to manage the selected filter option
  const [filter, setFilter] = useState("All");

  // Fetching notifications and socket from the store
  const { notifications, sendNotification, markAllNotificationRead } =
    useNotificationsStore();

  // Fetching link store to manage link requests
  const { changeLinkStatus } = useLinkStore();
  const { socket } = useSocket();

  // Function to handle the acceptance of a link request
  const handleLinkAccept = async (notification) => {
    try {
      const linkRequestReply = {
        sender: notification.receiver,
        receiver: notification.sender._id,
        type: "Response",
        response: "Accepted",
      };
      // Accept the link request
      await changeLinkStatus(notification.linkId, "Accepted");

      // notification for the sender of request
      const response = await sendNotification(linkRequestReply);

      if (!response.success) {
        toast.error("Failed to send notification");
        return;
      }

      // Fill the request with the notification id
      linkRequestReply.notificationId = response.newNotification._id;

      // Emit the notification to the sender
      await socket.emit("sendNotification", linkRequestReply);
    } catch (error) {
      toast.error("Failed to accept link request");
    }
  };

  const handleAction = (id, action) => {
    alert(`${action} request from user with id ${id}`);
  };

  // filter notifications based on the selected filter
  const filteredNotifications =
    filter === "All"
      ? notifications
      : notifications?.filter((n) => n.type === filter);

  //as user visits notification section mark all of them as read
  useEffect(() => {
    const hasUnread = notifications?.some((n) => n.status === "unread");

    if (hasUnread) {
      markAllNotificationRead();
    }
  }, [markAllNotificationRead, notifications]);

  // SEPERATE KRNA HAI ISKO AS UNTITLITY FUNCTION
  const getIcon = (type) => {
    switch (type) {
      case "Like":
        return <i className="icon like"></i>;
      case "Comment":
        return <i className="icon comment"></i>;
      case "Mention":
        return <i className="icon mention"></i>;
      case "Follow":
        return <i className="icon follow"></i>;
      default:
        return null;
    }
  };
  const getNotificationText = (type) => {
    switch (type) {
      case "Like":
        return "liked your post";
      case "Comment":
        return "commented on your post";
      case "Mention":
        return "mentioned you in a comment";
      case "Follow":
        return "started following you";
      default:
        return "";
    }
  };

  return (
    <ul className="notification-list">
      {notifications?.map((notification) => (
        <div
          key={notification._id}
          className={`notification-item ${notification.status}`}
        >
          <div className="notification-header">
            <div className="sender-info">
              <img
                src={resolveAvatar(notification.sender)}
                alt="sender"
                className="user-avatar"
              />
              <span className="sender-name">{notification.sender.name}</span>
            </div>
            <div className="notification-time">
              {getTimeAgo(notification.createdAt)}
            </div>
          </div>

          <div className="notification-message">
            {getNotificationText(notification.type) ||
              "wants to connect to you"}
          </div>

          {notification.type === "Link" && (
            <div className="link-actions">
              <button
                className="accept-button"
                onClick={() => handleLinkAccept(notification)}
              >
                Accept
              </button>
              <button
                className="reject-button"
                onClick={() => handleAction(notification.sender._id, "Reject")}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </ul>
  );
}
