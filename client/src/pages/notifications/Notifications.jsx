import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaComment,
  FaAt,
  FaUserPlus,
} from "react-icons/fa";
import "./notifications.css";
import { useNotificationsStore } from "../../store/useNotifications";
import { useLinkStore } from "../../store/useLinkStore";
import { useSocket } from "../../providers/Socket";
import toast from "react-hot-toast";


const iconMap = {
  Like: <FaHeart className="icon like" />,
  Comment: <FaComment className="icon comment" />,
  Mention: <FaAt className="icon mention" />,
  Follow: <FaUserPlus className="icon follow" />,
};

export default function Notifications() {
  const [filter, setFilter] = useState("All");

  const { notifications, sendNotification, markAllNotificationRead } = useNotificationsStore();
  const { changeLinkStatus } = useLinkStore();
  const { socket } = useSocket();

  //as user visits notification section mark all of them as read
  useEffect(() => {
    const hasUnread = notifications.some((n) => n.status === 'unread');
  
    if (hasUnread) {
      markAllNotificationRead();
    }
  }, [markAllNotificationRead, notifications]);
  

  const handleAction = (id, action) => {
    alert(`${action} request from user with id ${id}`);
  };

  const handleLinkAccept = async (notification)=>{
     try {
        
        const linkRequestReply = {
            sender: notification.receiver,
            receiver: notification.sender._id,
            type:"Response",
            response: "Accepted",
        }
        // Accept the link request
        await changeLinkStatus(notification.linkId, "Accepted");

        // notification for the sender of request
        const response = await sendNotification(linkRequestReply);

        if(!response.success) {
            toast.error("Failed to send notification");
            return;
        }

        // Fill the request with the notification id
        linkRequestReply.notificationId = response.newNotification._id;
 
        // Emit the notification to the sender
        await socket.emit("sendNotification", linkRequestReply)

     } catch (error) {
        toast.error("Failed to accept link request");
     }
  }

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
          <option value="Link">Links</option>
        </select>
      </div>

      <div className="notifications-list">
        {filteredNotifications?.map((n) => (
          <div className="notification-item" key={n.id}>
            <div className="notification-left">
              {iconMap[n.type]}
              <div>
                <p>
                  <strong>{n.sender.name}</strong>{" "}
                  {n.type === "Like" && "liked your post"}
                  {n.type === "Comment" && "commented on your post"}
                  {n.type === "Mention" && "mentioned you"}
                  {n.type === "Link" && "wants to follow you"}
                </p>
                <span className="notification-time">{n.createdAt}</span>
              </div>
            </div>

            {n.type === "Link" && (
              <div className="follow-actions">
                <button
                  className="accept-btn"
                  onClick={() => handleLinkAccept(n)}
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

{
            n.type === "Response" && (
               <h1>{n.response}</h1>
            )
          }
          </div>
        ))}

       

        {filteredNotifications?.length === 0 && (
          <p className="no-notifications">No notifications to show.</p>
        )}
      </div>
    </div>
  );
}
