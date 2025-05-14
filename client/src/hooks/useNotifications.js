import { useNotificationsStore } from "../store/useNotifications";
import { useLinkStore } from "../store/useLinkStore";
import { useSocket } from "../providers/Socket";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const useNotifications = () => {
  const { changeLinkStatus, sendRequest } = useLinkStore();
  const { prepareNotification, updateNotificationType } = useNotificationsStore();
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
      // const linkStatusUpdate = await changeLinkStatus(notification.linkId, response);
      // if (!linkStatusUpdate) return;

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
      if(!linkResponse) return ;

      linkRequest.linkId = linkResponse._id;

      //creating new notifications doc in db
      const createdNotification = await prepareNotification(linkRequest);
      if(!createdNotification) return ;
     

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

  return {
    notificationProcess,
    handleLinkResponse,
    sendLinkRequest,
  };
};

export default useNotifications;