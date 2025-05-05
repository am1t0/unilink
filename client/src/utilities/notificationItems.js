import {
    Heart,
    MessageCircle,
    UserPlus,
    Handshake,
    Bell,
  } from 'lucide-react';

export const getNotificationMessage = (notification) => {

    const { type, sender, postId, commentId } = notification;

    switch (type) {
        case "Link":
            return 'wants to connect with you';

        case "Accepted":
            return 'is now connected with you';

        case "Like":
            if (commentId) {
                return 'liked your comment';
            } else if (postId) {
                return 'liked your post';
            }
            return 'liked something';

        case "Comment":
           return 'commented on your post';

        default:
            return 'sent you a notification';
    }
};

export const getNotificationIcon = (notification) => {
    const { type, postId, commentId } = notification;
  
    switch (type) {
      case "Link":
        return <UserPlus className="notification-icon link" />;
  
      case "Accepted":
        return <Handshake className="notification-icon accepted" />;
  
      case "Like":
        if (commentId) {
          return <Heart className="notification-icon comment-like" />;
        } else if (postId) {
          return <Heart className="notification-icon post-like" />;
        }
        return <Heart className="notification-icon default-like" />;
  
      case "Comment":
        return <MessageCircle className="notification-icon comment" />;
  
      default:
        return <Bell className="notification-icon default" />;
    }
  };
  