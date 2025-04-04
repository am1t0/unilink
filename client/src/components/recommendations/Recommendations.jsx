import React, { useEffect, useState } from "react";
import "./recommendations.css";
import { useLinkStore } from "../../store/useLinkStore.js";
import { BsPersonPlusFill, BsChatDots } from "react-icons/bs";
import { Link} from "react-router";

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
              <Link  to={`/profilePage/${user._id}`} className="user-info-section">
                <img src={user.avatar || defaultAvatar} alt={user.name} />
                <div className="user-info">
                  <h4>{user.name}</h4>
                  <p>{user.collage}</p>
                </div>
              </Link>
              <div className="action-buttons">
                <button className="action-btn">
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
