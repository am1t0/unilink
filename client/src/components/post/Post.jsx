import React, { useState } from 'react';
import { ThumbsUp, MessageCircle, Send, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import './Post.css';

const Post = ({ mediaArray, description, createdAt, user }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const handleNext = () => {
    setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % mediaArray.length);
  };

  const handlePrev = () => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex === 0 ? mediaArray.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="post-container">
      <div className="post-header">
        <p className="post-date">{new Date(createdAt).toLocaleDateString()}</p>
        <div className="post-user-info">
          <div className="post-avatar">{user?.charAt(0)}</div>
          <div className="post-details">
            <div className="post-username-and-link">
              <h3 className="post-username">{user}</h3>
              <button className="post-link-btn">Link</button>
            </div>
            <p className="post-year">III Year</p>
          </div>
        </div>
      </div>

      <div className="post-description">
        <h3>DESCRIPTION</h3>
        <p>{description}</p>
      </div>

      <div className="post-media-container">
        {mediaArray.length > 1 && (
          <button className="nav-button prev-button" onClick={handlePrev}>
            <ChevronLeft size={24} />
          </button>
        )}
        <div className="post-media-wrapper">
          {mediaArray[currentMediaIndex].type === 'photo' ? (
            <img
              src={mediaArray[currentMediaIndex].url}
              alt={`Post Media ${currentMediaIndex}`}
              className="post-media"
            />
          ) : (
            <video
              src={mediaArray[currentMediaIndex].url}
              controls
              className="post-media"
            />
          )}
        </div>
        {mediaArray.length > 1 && (
          <button className="nav-button next-button" onClick={handleNext}>
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      <div className="post-actions">
        <div className="post-left-actions">
          <div className="post-action">
            <ThumbsUp size={20} />
            <span>100</span>
          </div>
          <div className="post-action">
            <MessageCircle size={20} />
            <span>10K</span>
          </div>
          <div className="post-action">
            <Send size={20} />
            <span>2K</span>
          </div>
        </div>
        <div className="post-right-action">
          <Bookmark size={20} />
          <span>Save</span>
        </div>
      </div>
    </div>
  );
};

export default Post;