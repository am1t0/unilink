import React, { useState } from "react";
import { BsArrowBarRight, BsArrowBarLeft } from "react-icons/bs";
import "./entry.css";
import FilterPost from "../../components/filterPost/FilterPost";
import Recommendations from "../../components/recommendations/Recommendations";
import PostList from "../../components/postList/PostList";
import AddPostBar from "../../components/addPostBar/AddPostBar";

export default function Entry() {
  const [showRecommendations, setShowRecommendations] = useState(true);

  return (
    <div className="entry-page">
      <FilterPost />
      
      <div className="middle-section">

         <AddPostBar/>

         <PostList />

      </div>

      {showRecommendations && <Recommendations />}
    </div>
  );
}
