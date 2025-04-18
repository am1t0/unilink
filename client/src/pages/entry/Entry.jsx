import React, { useState } from "react";
import { BsArrowBarRight, BsArrowBarLeft } from "react-icons/bs";
import "./entry.css";
import FilterPost from "../../components/filterPost/FilterPost";
import Recommendations from "../../components/recommendations/Recommendations";
import PostList from "../../components/postList/PostList";

export default function Entry() {
  const [showRecommendations, setShowRecommendations] = useState(true);

  return (
    <div className="entry-page">
      <FilterPost />

      <PostList />

      {showRecommendations && <Recommendations />}
    </div>
  );
}
