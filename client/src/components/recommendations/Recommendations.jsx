import React, { useEffect, useState } from "react";
import "./recommendations.css";
import { useLinkStore } from "../../store/useLinkStore.js";
import { BsPersonPlusFill, BsChatDots } from "react-icons/bs";
import { Link, useNavigate } from "react-router";
import { useSocket } from "../../providers/Socket.jsx";
import { useNotificationsStore } from "../../store/useNotifications.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import toast from "react-hot-toast";
import DefaultAvatar from '../../assets/images/avatar.png'
import { useMessageStore } from "../../store/useMessageStore.js";

const Recommendations = () => {
  //links related state and functions
  const { getUserRecommendations, recommendations, sendRequest, loading } =
    useLinkStore();
  const [ requesting, setRequesting] = useState(null);

  //notifications sender function
  const { sendNotification } = useNotificationsStore();

  // user and socket state
  const { authUser } = useAuthStore();
  const { socket } = useSocket();

  // create conversations function
  const { createConversation} = useMessageStore();
  const navigate = useNavigate();


  useEffect(() => {
    getUserRecommendations();
  }, [getUserRecommendations]);

  const sendLinkRequest = async (user) => {
    setRequesting(user._id)
    try {
      const linkRequest = {
        sender: authUser._id,
        receiver: user._id,
        type: "Link",
      };

      //intialiazing the link request doc in db
      const linkId = await sendRequest(linkRequest.receiver);

      linkRequest.linkId = linkId;

      //creating new notifications doc in db
      const response = await sendNotification(linkRequest);

      if (!response.success) {
        toast.error("Failed to send link request");
        return;
      }

      // filling request with the notification id
      linkRequest.notificationId = response.newNotification._id;

      // emitting the notification to the receiver
      await socket.emit("sendNotification", linkRequest);

      toast.success("Link request sent successfully");
    } catch (error) {
      toast.error("Failed to send link request");
    } finally {
      setRequesting(null)
    }
  };

  const handleMessageClick = async (userId)=>{
      const members = [authUser._id, userId];

      // form the conversation
      const response = await createConversation(members);

      if(!response) return;

      // redirect to the messages page
      navigate(`/chats`);
  }

  return (
    <div className="recommendations">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h3 className="recommendations-title">Recommendations</h3>
          {recommendations?.map((user) => (
            <div key={user._id} className="user-card">
              <Link
                to={`/profilePage/${user._id}`}
                className="user-info-section"
              >
                <img src={user.avatar || DefaultAvatar} alt={user.name} />
                <div className="user-info">
                  <h4>{user.name}</h4>
                  <p>{user.collage}</p>
                </div>
              </Link>
              <div className="action-buttons">
                <button
                  className={`action-btn ${
                    user.status === "Requested" ? "requested" : ""
                  }`}
                  onClick={() => sendLinkRequest(user)}
                  disabled={user.status === "Requested" || requesting}
                >
                  <BsPersonPlusFill />{" "}
                  {
                  (requesting === user._id)?"Requesting..." :
                  
                   (user.status === "Requested" ?"Requested" : "Link")
                  }
                </button>

                <button className="action-btn" onClick={()=> handleMessageClick(user._id)}>
                  <BsChatDots /> Message
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Recommendations;
