import React, { useEffect, useState } from "react";
import "./recommendations.css";
import { useLinkStore } from "../../store/useLinkStore.js";
import { BsPersonPlusFill, BsChatDots } from "react-icons/bs";
import { Link} from "react-router";
import { useSocket } from "../../providers/Socket.jsx";
import { useNotificationsStore } from "../../store/useNotifications.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import toast from "react-hot-toast";

const Recommendations = () => {

 const {getUserRecommendations ,recommendations, sendRequest, loading} = useLinkStore();
 const { sendNotification } = useNotificationsStore();
 const { authUser } = useAuthStore();
 const { socket } = useSocket();

  useEffect(() => {
    getUserRecommendations();
  }, [getUserRecommendations]);


  const defaultAvatar =
  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  const sendLinkRequest = async ( user )=>{
      try {
        const linkRequest = {
          sender: authUser._id,
          receiver: user._id,
          type: "Link",
        }
        
        //intialiazing the link request
       const linkId  =  await sendRequest(linkRequest.receiver);

       linkRequest.linkId = linkId

        //creating new notifications doc in db
        const response = await sendNotification(linkRequest);
  
   
        if( !response.success ) {
          toast.error("Failed to send link request");
          return;
        }

        // filling request with the notification id
        linkRequest.notificationId = response.newNotification._id

        // emitting the notification to the receiver
       await socket.emit("sendNotification", linkRequest);

      toast.success("Link request sent successfully");

      } catch (error) {
        toast.error("Failed to send link request");
      }
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
              <Link  to={`/profilePage/${user._id}`} className="user-info-section">
                <img src={user.avatar || defaultAvatar} alt={user.name} />
                <div className="user-info">
                  <h4>{user.name}</h4>
                  <p>{user.collage}</p>
                </div>
              </Link>
              <div className="action-buttons">
                <button className="action-btn" onClick={()=> sendLinkRequest( user)}>
                  <BsPersonPlusFill /> Link
                </button>
                <button className="action-btn">
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
