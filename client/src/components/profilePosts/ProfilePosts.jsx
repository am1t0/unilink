import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import './profilePosts.css';
import { resolveAvatar } from '../../utilities/defaultImages.js';
import { ChevronLeft, ChevronRight } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function ProfilePosts({ posts, fetchMorePosts, hasMore }) {
  const [mediaIndices, setMediaIndices] = useState({}); // Track current media index per post

  const handleNext = (postId, mediaLength) => {
    setMediaIndices((prev) => ({
      ...prev,
      [postId]: (prev[postId] + 1) % mediaLength || 0,
    }));
  };

  const handlePrev = (postId, mediaLength) => {
    setMediaIndices((prev) => ({
      ...prev,
      [postId]:
        (prev[postId] - 1 + mediaLength) % mediaLength || mediaLength - 1,
    }));
  };

  return (
    <div className="user-posts-container">
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMorePosts}
        hasMore={hasMore}
        loader={<div className="user-posts-infinite-scroll-loader">Loading...</div>}
        endMessage={<p className="user-posts-no-more">No more posts</p>}
      >
        <div className="user-posts-grid">
          {posts?.map((post) => {
            const mediaArray = post.media || [];
            const currentIndex = mediaIndices[post._id] || 0;
            const currentMedia = mediaArray[currentIndex];

            return (
              <div key={post._id} className="user-post-card">
                {/* User Info */}
                <div className="user-post-user">
                  <img
                    src={resolveAvatar(post.user)}
                    alt={post.user.name}
                    className="user-post-pic"
                  />
                  <div className="user-post-info">
                    <h4>{post.user.name}</h4>
                    <span className="user-post-tag">{post.tag}</span>
                  </div>
                  <button className="user-post-options">
                    <BsThreeDots />
                  </button>
                </div>

                {/* Media Viewer */}
                {mediaArray.length > 0 && (
                  <div className="user-post-media-container">
                    {mediaArray.length > 1 && (
                      <button
                        className="user-post-nav-button user-post-prev-button"
                        onClick={() => handlePrev(post._id, mediaArray.length)}
                      >
                        <ChevronLeft size={20} />
                      </button>
                    )}

                    <div className="user-post-media-wrapper">
                      {currentMedia?.type === "photo" ? (
                        <img
                          src={currentMedia.url}
                          alt="Post media"
                          className="user-post-media"
                        />
                      ) : (
                        <video
                          src={currentMedia.url}
                          controls
                          className="user-post-media"
                        />
                      )}
                    </div>

                    {mediaArray.length > 1 && (
                      <button
                        className="user-post-nav-button user-post-next-button"
                        onClick={() => handleNext(post._id, mediaArray.length)}
                      >
                        <ChevronRight size={20} />
                      </button>
                    )}
                  </div>
                )}

                {/* Description */}
                <p className="user-post-description">{post.description}</p>
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
}
