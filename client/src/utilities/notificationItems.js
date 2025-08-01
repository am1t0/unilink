import {
    Heart,
    MessageCircle,
    UserPlus,
    Handshake,
    Bell,
  } from 'lucide-react';

export const getNotificationMessage = (notification) => {

    const { type, sender, postId, commentId } = notification;

    console.log(type);
    switch (type) {
        case "Link":
            return 'wants to connect with you';

        case "Accepted":
            return 'is now connected with you';

        case "Post-Like":
            return 'liked your post';
        
        case "Comment":
           return 'commented on your post';
        
        case "Comment-Like":
           return 'Liked your comment';

        case "Link-Accepted":
            return 'and you are now connected';
            
        default:
            return 'sent you a notification';
    }
};

export const getNotificationIcon = (notification) => {
    const { type } = notification;
  
    switch (type) {
      case "Link":
        return <UserPlus className="notification-icon link" />;
  
      case "Link-Accepted":
        return <Handshake className="notification-icon accepted" />;
  
      case "Post-Like":
          return <Heart className="notification-icon post-like" />;

      case "Comment":
        return <MessageCircle className="notification-icon comment" />;
      
      case "Comment-Like":
        return <Heart className="notification-icon comment-like"/>;
  
      default:
        return <Bell className="notification-icon default" />;
    }
  };
  