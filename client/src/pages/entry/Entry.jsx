import React, { useEffect, useState } from "react";
import { BsArrowBarRight, BsArrowBarLeft } from "react-icons/bs";
import "./entry.css";
import FilterPost from "../../components/filterPost/FilterPost";
import Recommendations from "../../components/recommendations/Recommendations";
import PostList from "../../components/postList/PostList";
import AddPostBar from "../../components/addPostBar/AddPostBar";
import { useSavePostsStore } from "../../store/useSavePostsStore";

export default function Entry() {
  const [showRecommendations, setShowRecommendations] = useState(false);

  const { getSavedPosts } = useSavePostsStore();

  useEffect(() => {
    getSavedPosts(); // Fetch saved posts when component mounts
  }, [getSavedPosts]);

  return (
    <div className={`entry-page ${showRecommendations ? 'show-recommendations' : ''}`}>
      <div className="filter-section">
        <FilterPost />
      </div>
      
      <div className="middle-section">
        <AddPostBar />
        <PostList />
      </div>

      <div className="recommendations-section">
        <Recommendations />
      </div>

      <button 
        className="toggle-recommendations"
        onClick={() => setShowRecommendations(!showRecommendations)}
      >
        {showRecommendations ? <BsArrowBarRight size={20} /> : <BsArrowBarLeft size={20} />}
      </button>
    </div>
  );
}