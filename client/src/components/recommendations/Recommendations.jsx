import React, { useEffect} from "react";
import "./recommendations.css";
import { useLinkStore } from "../../store/useLinkStore.js";
import { BsPersonPlusFill, BsChatDots } from "react-icons/bs";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore.js";
import DefaultAvatar from "../../assets/images/avatar.png";
import { useMessageStore } from "../../store/useMessageStore.js";
import useNotifications from "../../hooks/useNotifications.js";

const Recommendations = () => {
  //links related state and functions
  const { getUserRecommendations, recommendations, loading } =
    useLinkStore();
  const { sendLinkRequest, notificationProcess } = useNotifications();

  // user and socket state
  const { authUser } = useAuthStore();

  // create conversations function
  const { createConversation } = useMessageStore();
  const navigate = useNavigate();

  useEffect(() => {
    getUserRecommendations();
  }, [getUserRecommendations]);

  const handleMessageClick = async (userId) => {
    const members = [authUser._id, userId];

    // form the conversation
    const response = await createConversation(members);

    if (!response) return;

    // redirect to the messages page
    navigate(`/chats`);
  };

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
                  disabled={user.status === "Requested" || notificationProcess?.id === user._id}
                >
                  <BsPersonPlusFill />{" "}
                  {notificationProcess?.id === user._id
                    ? "Requesting..."
                    : user.status === "Requested"
                    ? "Requested"
                    : "Link"}
                </button>

                <button
                  className="action-btn"
                  onClick={() => handleMessageClick(user._id)}
                >
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
