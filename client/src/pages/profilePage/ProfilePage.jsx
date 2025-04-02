import React from "react";
import "./profilepage.css";
import { useAuthStore } from "../../store/useAuthStore";
import ProfileCard from "../../components/profileCard/ProfileCard";
import ProfileSections from "../../components/profileSections/ProfileSections";
import ProfilePosts from "../../components/profilePosts/ProfilePosts";
import ProfileCarrer from "../../components/profileCarrer/ProfileCarrer";

const ProfilePage = () => {

  return (
    <div className="profile-page">
      <ProfileSections />
      <div className="profile-content">
        <div id="overview">
          <ProfileCard />
        </div>

        <div id="posts" className="posts-section">
            <div className="section-header">
              <h2>Posts</h2>
            </div>
            <ProfilePosts />
          </div>
         
        </div>
    </div>
  );
};

export default ProfilePage;
