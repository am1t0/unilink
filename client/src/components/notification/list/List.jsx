import React, { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "./list.css";
import { useNotificationsStore } from "../../../store/useNotifications";
import { useLinkStore } from "../../../store/useLinkStore";
import { useSocket } from "../../../providers/Socket";
import toast from "react-hot-toast";
import { resolveAvatar } from "../../../utilities/defaultImages";
import { getTimeAgo } from "../../../utilities/timeAndDate";
import { getNotificationMessage } from "../../../utilities/notificationItems";
import { getNotificationIcon } from "../../../utilities/notificationItems";
import Loader from "../../loader/Loader";

export default function List() {
  const {
    notifications,
    getNotifications,
    sendNotification,
    hasMore,
  } = useNotificationsStore();
  const { changeLinkStatus } = useLinkStore();
  const { socket } = useSocket();

  const handleLinkAccept = async (notification) => {
    try {
      const linkRequestReply = {
        sender: notification.receiver,
        receiver: notification.sender._id,
        type: "Response",
        response: "Accepted",
      };
      await changeLinkStatus(notification.linkId, "Accepted");
      const response = await sendNotification(linkRequestReply);

      if (!response.success) {
        toast.error("Failed to send notification");
        return;
      }

      linkRequestReply.notificationId = response.newNotification._id;
      await socket.emit("sendNotification", linkRequestReply);
    } catch (error) {
      toast.error("Failed to accept link request");
    }
  };

  const handleAction = (id, action) => {
    alert(`${action} request from user with id ${id}`);
  };

  return (
    <div className="notification-list-container">
      <InfiniteScroll
        dataLength={notifications?.length || 0} // Length of current notifications
        next={getNotifications} // Function to fetch more notifications
        hasMore={hasMore} // Whether more notifications are available
        loader={
          <div className="infinite-scroll-loader">
            <Loader size={20} color="white" />
          </div>
        } // Loader to show while fetching
        endMessage={<p className="no-more-notification">No more notifications</p>} // Message when all notifications are loaded
      >
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
      </InfiniteScroll>
    </div>
  );
}
