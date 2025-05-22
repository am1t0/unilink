import React, { useEffect, useState, useCallback } from "react";
import "./profilepage.css";
import { useAuthStore } from "../../store/useAuthStore";
import ProfileCard from "../../components/profileCard/ProfileCard";
import ProfileSections from "../../components/profileSections/ProfileSections";
import ProfilePosts from "../../components/profilePosts/ProfilePosts";
import ProfileCarrer from "../../components/profileCarrer/ProfileCarrer";
import { useParams } from "react-router";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-hot-toast";
import { usePostStore } from "../../store/usePostStore";

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // user and posts functions
  const { profileId } = useParams();
  const { authUser, getProfile } = useAuthStore();
  const { getUserPosts } = usePostStore();

  useEffect(() => {
    setUserPosts([]); // Reset posts
    setHasMore(true);
    getProfile(profileId, setUserProfile);

    // Fetch first page
    getUserPosts(profileId, setUserPosts, 1).then((res) => {
      if (res) setHasMore(res.hasMore);
    });
  }, [profileId, authUser, getProfile, getUserPosts]);

  // Function to fetch more posts (for InfiniteScroll)
  const fetchMorePosts = useCallback(() => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      getUserPosts(profileId, setUserPosts, nextPage).then((res) => {
        if (res) setHasMore(res.hasMore);
      });
      return nextPage;
    });
  }, [profileId, getUserPosts]);

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
          <ProfilePosts
            posts={userPosts}
            fetchMorePosts={fetchMorePosts}
            hasMore={hasMore}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
