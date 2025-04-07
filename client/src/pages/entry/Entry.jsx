import React, { useState } from 'react'
import { BsArrowBarRight, BsArrowBarLeft } from 'react-icons/bs'
import './entry.css'
import FilterPost from '../../components/filterPost/FilterPost'
import Recommendations from '../../components/recommendations/Recommendations'
import PostList from '../../components/postList/PostList'

export default function Entry() {
  const [showRecommendations, setShowRecommendations] = useState(true);

  return (
    <div className='entry-page'>
      <FilterPost/>
      <div className={`posts-recommendation-container ${!showRecommendations ? 'expanded' : ''}`}>
        <div className="post-section">
          <PostList/>
        </div>
        {showRecommendations && (
          <div className="recommendations-section">
            <Recommendations/>
          </div>
        )}
        <button 
          className="toggle-recommendations"
          onClick={() => setShowRecommendations(!showRecommendations)}
        >
          {showRecommendations ? <BsArrowBarRight /> : <BsArrowBarLeft />}
        </button>
      </div>
    </div>
  )
}
