import { useNotificationsStore } from "../store/useNotifications";
import { useLinkStore } from "../store/useLinkStore";
import { useSocket } from "../providers/Socket";
import toast from "react-hot-toast";

const useNotifications = () => {
  const { changeLinkStatus } = useLinkStore();
  const { sendNotification } = useNotificationsStore();
  const { socket } = useSocket();

  const handleLinkResponse = async (notification, flag) => {
    try {
      const linkRequestReply = {
        sender: notification.receiver,
        receiver: notification.sender._id,
        type: "Response",
        response: flag ? "Accepted" : "Rejected",
      };
      await changeLinkStatus(notification.linkId, flag ? "Accepted" : "Rejected");
      const response = await sendNotification(linkRequestReply);

      if (!response.success) {
        toast.error("Failed to send notification");
        return;
      }

      linkRequestReply.notificationId = response.newNotification._id;
      await socket.emit("sendNotification", linkRequestReply);
    } catch (error) {
      toast.error("Failed to process link request");
    }
  };

  return {
    handleLinkResponse,
  };
};

export default useNotifications;