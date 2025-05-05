import React, { useEffect, useState } from "react";
import "./list.css";
import { useNotificationsStore } from "../../../store/useNotifications";
import { useLinkStore } from "../../../store/useLinkStore";
import { useSocket } from "../../../providers/Socket";
import toast from "react-hot-toast";
import { resolveAvatar } from "../../../utilities/defaultImages";
import { getTimeAgo } from "../../../utilities/timeAndDate";
import { getNotificationMessage } from "../../../utilities/notificationItems";
import { getNotificationIcon } from "../../../utilities/notificationItems";

export default function List() {
  // Filter state to manage the selected filter option
  const [filter, setFilter] = useState("All");

  // Fetching notifications and socket from the store
  const { sendNotification } = useNotificationsStore();

  const notifications = [
    {
      _id: "1",
      sender: {
        _id: "user123",
        name: "Amit Sharma",
        avatar: "",
      },
      receiver: "user456",
      type: "Like",
      status: "unread",
      deliveryMethod: "socket",
      postId: "post789",
      createdAt: "2025-05-03T10:15:00.000Z",
      updatedAt: "2025-05-03T10:15:00.000Z",
    },
    {
      _id: "2",
      sender: {
        _id: "user234",
        name: "Sneha Mehta",
        avatar: "",
      },
      receiver: "user456",
      type: "Comment",
      status: "read",
      deliveryMethod: "socket",
      postId: "post790",
      commentId: "comment101",
      createdAt: "2025-05-03T11:20:00.000Z",
      updatedAt: "2025-05-03T11:20:00.000Z",
    },
    {
      _id: "3",
      sender: {
        _id: "user345",
        name: "Nitish Rajput",
        avatar: "",
      },
      receiver: "user456",
      type: "Link",
      status: "read",
      deliveryMethod: "socket",
      linkId: "link112",
      createdAt: "2025-05-03T12:21:23.012Z",
      updatedAt: "2025-05-03T12:24:02.483Z",
    },
    {
      _id: "4",
      sender: {
        _id: "user456",
        name: "Priya Yadav",
        avatar: "",
      },
      receiver: "user789",
      type: "Mention",
      status: "unread",
      deliveryMethod: "socket",
      postId: "post999",
      commentId: "comment202",
      createdAt: "2025-05-02T14:30:00.000Z",
      updatedAt: "2025-05-02T14:30:00.000Z",
    },
    {
      _id: "5",
      sender: {
        _id: "user678",
        name: "Rahul Verma",
        avatar: "",
      },
      receiver: "user456",
      type: "Response",
      status: "unread",
      deliveryMethod: "socket",
      linkId: "link113",
      response: "Accepted",
      createdAt: "2025-05-01T09:00:00.000Z",
      updatedAt: "2025-05-01T09:00:00.000Z",
    },
  ];

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
  // useEffect(() => {
  //   const hasUnread = notifications?.some((n) => n.status === "unread");

  //   if (hasUnread) {
  //     markAllNotificationRead();
  //   }
  // }, [markAllNotificationRead, notifications]);

  return (
    <div className="notification-list-container">
      <ul className="notification-list">
        {notifications?.map((notification) => (
          <div
            key={notification._id}
            className={`notification-item ${notification.status}`}
          >
            <div className="notification-header">
              <div className="sender-info">
                {getNotificationIcon(notification)}
                <img
                  src={resolveAvatar(notification.sender)}
                  alt="sender"
                  className="user-avatar"
                />
                <h4>{notification.sender.name}</h4>
                <p>{getNotificationMessage(notification)}</p>
              </div>
              <p className="notification-time">
                {getTimeAgo(notification.createdAt)}
              </p>
            </div>

            <div className="notification-other-content">
              {notification.type === "Comment" && (
                <p className="comment-text">
                  Good Job Anshul 🚀 Keep going forward and shine. All the best
                  ✨
                </p>
              )}

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
                    onClick={() =>
                      handleAction(notification.sender._id, "Reject")
                    }
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}
