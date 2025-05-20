import { useNotificationsStore } from "../store/useNotifications";
import { useLinkStore } from "../store/useLinkStore";
import { useSocket } from "../providers/Socket";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { usePostStore } from "../store/usePostStore";
import { useCommentStore } from "../store/useCommentStore";

const useNotifications = () => {
  const { changeLinkStatus, sendRequest } = useLinkStore();
  const { addComment, toggleCommentLike } = useCommentStore();
  const { prepareNotification, updateNotificationType } = useNotificationsStore();
  const { likePost, commentCountIncrement } = usePostStore();
  const { authUser } = useAuthStore();
  const { socket } = useSocket();

  const [notificationProcess, setNotificationProcess] = useState(null);

  const handleLinkResponse = async (notification, response) => {

    setNotificationProcess({
      id: notification._id,
      process: response,
    });

    try {
      // Change link status
      const linkStatusUpdate = await changeLinkStatus(notification.linkId, response);
      if (!linkStatusUpdate) return;

      // If user ignored the request, don't send notification,update the notification to ignored
      if (response === "Ignore") {
        await updateNotificationType(notification._id, "Link-Ignored");
        return;
      }

      const notificationData = {
        sender: notification.receiver,
        receiver: notification.sender._id,
        type: "Link-Accepted",
        notificationId: notification._id,
      };

      // Create notification document
      const createdNotification = await prepareNotification(notificationData);
      if (!createdNotification) return;

      notificationData.notificationId = createdNotification.notificationId;

      // Send notification through socket
      await socket.emit("sendNotification", notificationData);

    } catch (error) {
      toast.error("Failed to process link request");
    } finally {
      setNotificationProcess(null);
    }
  };

  const sendLinkRequest = async (user) => {

    setNotificationProcess({
      id: user._id,
      process: "request",
    });

    try {
      const linkRequest = {
        sender: authUser._id,
        receiver: user._id,
        type: "Link",
      };

      //intialiazing the link request doc in db
      const linkResponse = await sendRequest(user._id);
      if (!linkResponse) return;

      linkRequest.linkId = linkResponse._id;

      //creating new notifications doc in db
      const createdNotification = await prepareNotification(linkRequest);
      if (!createdNotification) return;


      // filling request with the notification id
      linkRequest.notificationId = createdNotification.notificationId;

      // emitting the notification to the receiver
      await socket.emit("sendNotification", linkRequest);

      toast.success("Link request sent successfully");
    } catch (error) {
      toast.error("Failed to send link request");
    } finally {
      setNotificationProcess(null);
    }
  };

  const handleToggleLike = async (postId, user) => {

    try {
      //first handle the change in like
      const likeResponse = await likePost(postId, authUser);
      if (!likeResponse || !likeResponse.liked) return;

      const notificationData = {
        sender: authUser._id,
        receiver: user._id,
        type: "Like",
        postId
      }
      const createdNotification = await prepareNotification(notificationData);
      if (!createdNotification.success) return;

      notificationData.notificationId = createdNotification.notificationId;

      // Send notification through socket
      await socket.emit("sendNotification", notificationData);

    } catch (error) {
      toast.error("Failed to like post")
    }
  }

  const handleAddComment = async (user, postId, text, setInput, parentId = null) => {
    try {
      if (text.trim() === "") return;

      //first handle the change in like
      const commentResponse = await addComment(postId, text);
      if (!commentResponse) return;

      commentCountIncrement(postId);

      //reset comment box
      setInput("");

      const { _id } = commentResponse.comment

      //increase comment count

      const notificationData = {
        sender: authUser._id,
        receiver: user._id,
        type: "Comment",
        commentId: _id
      }
      const createdNotification = await prepareNotification(notificationData);
      if (!createdNotification.success) return;

      notificationData.notificationId = createdNotification.notificationId;

      // Send notification through socket
      await socket.emit("sendNotification", notificationData);

    } catch (error) {
      toast.error("Failed to like post")
    }
  }

  const handleLikeComment = async (commentId, userId) => {
    try {
      // Change link status
      const commentLikeResponse = await toggleCommentLike(commentId, userId);
      if (!commentLikeResponse) return;

      const notificationData = {
        sender: authUser._id,
        receiver: userId,
        type: "Comment-Like",
        commentId
      }
      const createdNotification = await prepareNotification(notificationData);
      if (!createdNotification.success) return;

      notificationData.notificationId = createdNotification.notificationId;

      // Send notification through socket
      await socket.emit("sendNotification", notificationData);

    } catch (error) {
      toast.error("Failed to like post")
    }
  }

  return {
    notificationProcess,
    handleLinkResponse,
    handleToggleLike,
    handleAddComment,
    sendLinkRequest,
    handleLikeComment
  };
};

export default useNotifications;