import React, { useState, useEffect } from "react";
import {
  ThumbsUp,
  MessageCircle,
  Send,
  Bookmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./Post.css";
import Comments from "../comments/Comments";
import { usePostStore } from "../../store/usePostStore";
import { useAuthStore } from "../../store/useAuthStore";

const Post = ({
  postId,
  mediaArray,
  description,
  createdAt,
  user,
  likeCount,
  commentCount,
  share,
  likedBy,
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showComments, setShowComments] = useState(false); // State to manage comment visibility
  const [liked, setLiked] = useState(false);
  const [likeCounts, setLikedCounts] = useState(likeCount);
  const [commentCounts, setCommentCounts] = useState(commentCount);
  const {likePost} = usePostStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (likedBy?.includes(authUser._id)) {
      setLiked(true);
    }
  }, [authUser._id, likedBy, user._id]);

  const handleNext = () => {
    setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % mediaArray.length);
  };

  const handlePrev = () => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex === 0 ? mediaArray.length - 1 : prevIndex - 1
    );
  };

  const toggleComments = () => {
    setShowComments(!showComments); // Toggle comment visibility
  };

  const postLikedFunction = () => { 
    setLiked(!liked);
    if(liked){
      setLikedCounts(likeCounts - 1);
    }else{
      setLikedCounts(likeCounts + 1);
    }
    likePost(postId);
  }

  const fetchPostUser = () => {
    
  }

  return (
    <div className="post-container">
      <div className="post-header">
        <p className="post-date">{new Date(createdAt).toLocaleDateString()}</p>
        <div className="post-user-info">
          <div className="post-avatar">
            <img src={user.avatar} alt={user.name.charAt(0)} />
          </div>
          <div className="post-details">
            <div className="post-username-and-link">
              <h3 className="post-username" onClick={fetchPostUser}>{user.name}</h3>
              <button className="post-link-btn">Link</button>
            </div>
            <p className="post-year">{user.position}</p>
          </div>
        </div>
      </div>

      {description && (
        <div className="post-description">
          <h3>DESCRIPTION</h3>
          <p>{description}</p>
        </div>
      )}

      {mediaArray.length > 0 && (
        <div className="post-media-container">
          {mediaArray.length > 1 && (
            <button className="nav-button prev-button" onClick={handlePrev}>
              <ChevronLeft size={24} />
            </button>
          )}
          <div className="post-media-wrapper">
            {mediaArray[currentMediaIndex].type === "photo" ? (
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
      )}

      <div className="post-actions">
        <div className="post-left-actions">
          <div className="post-action">
            <div onClick={postLikedFunction}>
              {!liked && <ThumbsUp size={20} />}
              {liked && <ThumbsUp size={20} color="blue" fill="blue" />}
            </div>
            <span>{likeCounts}</span>
          </div>
          <div className="post-action" onClick={toggleComments}>
            {" "}
            {/* Add click handler */}
            <MessageCircle size={20} />
            <span>{commentCounts}</span>
          </div>
          <div className="post-action">
            <Send size={20} />
            <span>{share}</span>
          </div>
        </div>
        <div className="post-right-action">
          <Bookmark size={20} />
          <span>Save</span>
        </div>
      </div>

      {/* Pop-up Comments Section */}
      {showComments && (
        <div className="comments-popup-overlay">
          <div className="comments-popup">
            <div className="comments-popup-header">
              <h3>Comments</h3>
              <button className="close-button" onClick={toggleComments}>
                &times;
              </button>
            </div>
            <div className="comments-popup-content">
              <Comments postId={postId} setCommentCounts={setCommentCounts}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
