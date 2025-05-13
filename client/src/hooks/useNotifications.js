import { useNotificationsStore } from "../store/useNotifications";
import { useLinkStore } from "../store/useLinkStore";
import { useSocket } from "../providers/Socket";
import toast from "react-hot-toast";

const useNotifications = () => {
  const { changeLinkStatus } = useLinkStore();
  const { prepareNotification } = useNotificationsStore();
  const { socket } = useSocket();

  const handleLinkResponse = async (notification, response) => {
    try {
      // Change link status
      const linkStatusUpdate = await changeLinkStatus(notification.linkId, response);
      if (!linkStatusUpdate) return;

      // If user ignored the request, don't send notification
      if (response === "Ignore") return;

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
    }
  };

  return {
    handleLinkResponse,
  };
};

export default useNotifications;