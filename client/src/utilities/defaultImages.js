import defaultAvatar from "../assets/images/avatar.png";
// import defaultBanner from "../assets/images/banner.png";

export const resolveAvatar = (user) => {
    if(user?.avatar) return user.avatar;

    return defaultAvatar;
}

export const resolveBanner = (user) => {
    if(user?.banner) return user.banner;

    return '';
}