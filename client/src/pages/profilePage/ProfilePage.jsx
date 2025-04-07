import React, { useEffect, useState } from "react";
import "./profilepage.css";
import { useAuthStore } from "../../store/useAuthStore";
import ProfileCard from "../../components/profileCard/ProfileCard";
import ProfileSections from "../../components/profileSections/ProfileSections";
import ProfilePosts from "../../components/profilePosts/ProfilePosts";
import ProfileCarrer from "../../components/profileCarrer/ProfileCarrer";
import { useParams } from "react-router";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const { profileId } = useParams();
  const { authUser, getProfile } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {

        // Check if the profileId is valid
        if (profileId === authUser?._id) {
          setUserProfile(authUser);
          return;
        }

        // Fetch the profile data from the server
        const profile = await getProfile(profileId);

        setUserProfile(profile);

      } catch (error) {
        toast.error("Error fetching profile");
        console.error(error);
      }
    };

    fetchProfile();
  }, [profileId, authUser, getProfile]);

  return (
    <div className="profile-page">
      <ProfileSections />
      <div className="profile-content">
        <div id="overview">
          {userProfile && <ProfileCard user={userProfile} />}
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
