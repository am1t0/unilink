import InfiniteScroll from "react-infinite-scroll-component";
import "./list.css";
import { useNotificationsStore } from "../../../store/useNotifications";
import { resolveAvatar } from "../../../utilities/defaultImages";
import { getTimeAgo } from "../../../utilities/timeAndDate";
import { getNotificationMessage } from "../../../utilities/notificationItems";
import { getNotificationIcon } from "../../../utilities/notificationItems";
import Loader from "../../loader/Loader";
import useNotifications from "../../../hooks/useNotifications";

export default function List() {

  // Zustand store for notifications
  const { notifications, getNotifications, hasMore } = useNotificationsStore();
  
  // notification hook combining usage of several store functions
  const { handleLinkResponse, notificationProcess } = useNotifications();

  return (
    <div className="notification-list-container">
      <InfiniteScroll
        dataLength={notifications?.length || 0}
        next={getNotifications}
        hasMore={hasMore}
        loader={
          <div className="infinite-scroll-loader">
            <Loader size={20} color="white" />
          </div>
        }
        endMessage={
          <p className="no-more-notification">No more notifications</p>
        }
      >
        <ul className="notification-list">
          {notifications?.map((notification) => {
            // Skip rendering if notification type is 'Link-Ignored'
           if (notification.type === "Link-Ignored") return null;

            return (
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
                      Good Job Anshul 🚀 Keep going forward and shine. All the
                      best ✨
                    </p>
                  )}

                  {notification.type === "Link" && (
                    <div className="link-actions">
                      <button
                        className="accept-button"
                        onClick={() => handleLinkResponse(notification, "Link")}
                      >
                        {notificationProcess?.id === notification._id 
                         ? ( <Loader size={15} color="white" /> ) 
                         : ( "Accept" )}
                      </button>
                      <button
                        className="reject-button"
                        onClick={() =>
                          handleLinkResponse(notification, "Ignore")
                        }
                      >
                        {notificationProcess?.id === notification._id 
                         ? ( <Loader size={15} color="white" /> ) 
                         : ( "Ignore" )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </ul>
      </InfiniteScroll>
    </div>
  );
}
