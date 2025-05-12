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
      //change link status 
      await changeLinkStatus(notification.linkId, flag ? "Link" : "Ignored");

      // as user ignored the request, we don't need to send notification
      if(!flag) return;

      const linkRequestReply = {
        sender: notification.receiver,
        receiver: notification.sender._id,
        type: "Response",
        response: "Accepted",
      };
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