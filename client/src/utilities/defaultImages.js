import defaultAvatar from "../assets/images/avatar.png";
import defaultNotificationMedia from "../assets/images/notification.png";
// import defaultBanner from "../assets/images/banner.png";

export const resolveAvatar = (user) => {
    if(user?.avatar) return user.avatar;

    return defaultAvatar;
}

export const resolveBanner = (user) => {
    if(user?.banner) return user.banner;

    return '';
}

export const resolveNotificationMedia = (notification)=> {
    const { media } = notification.postId;
    if(media.length > 0) return  notification.postId.media[0].url;
    return defaultNotificationMedia;
}