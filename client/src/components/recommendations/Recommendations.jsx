import React, { useEffect, useState } from "react";
import "./recommendations.css";
import { useLinkStore } from "../../store/useLinkStore.js";
import { BsPersonPlusFill, BsChatDots } from "react-icons/bs";
import { Link } from "react-router";

const Recommendations = () => {

 const {getUserRecommendations ,recommendations, loading} = useLinkStore();

  useEffect(() => {
    getUserRecommendations();
  }, [getUserRecommendations]);


  const defaultAvatar =
  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  return (
    <div className="recommendations">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h3 className="recommendations-title">Recommendations</h3>
          {recommendations?.map((user) => (
            <div key={user._id} className="user-card">
              <Link to={`/profilePage/${user._id}`} className="user-main">
                <img src={user.avatar || defaultAvatar} alt={user.name} />
                <div className="user-info">
                  <h4>{user.name}</h4>
                  <p>{user.collage}</p>
                </div>
              </Link>
              <div className="action-buttons">
                <button className="connect-user">
                  <span className="icon-wrapper">
                    <BsPersonPlusFill />
                  </span>
                  <span className="button-text">Link</span>
                </button>
                <button className="message-user">
                  <span className="icon-wrapper">
                    <BsChatDots />
                  </span>
                  <span className="button-text">Message</span>
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
