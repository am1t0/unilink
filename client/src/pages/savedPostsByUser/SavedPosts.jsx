import React, { useEffect, useRef, useCallback } from "react";
import Header from "../../components/header/Header";
import { useSavePostsStore } from "../../store/useSavePostsStore";
import Post from "../../components/post/Post";
import "./SavedPosts.css";

const SavedPosts = () => {
  const { savedPosts, getSavedPosts, hasMore, resetSavedPosts } =
    useSavePostsStore();
  const observer = useRef();

  useEffect(() => {
    resetSavedPosts();
    getSavedPosts();
  }, []);

  const lastPostRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          getSavedPosts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, getSavedPosts]
  );

  return (
    <div className="saved-posts-container">
      <Header />
      <div className="post-grid">
        {savedPosts.map((post, index) => {
          const isLast = index === savedPosts.length - 1;
          return (
            <div
              className="post-item"
              ref={isLast ? lastPostRef : null}
              key={post._id}
            >
              <Post
                postId={post._id}
                mediaArray={post.media}
                description={post.description}
                createdAt={post.createdAt}
                user={post.user}
                likeCount={post.likeCount}
                commentCount={post.commentCount}
                share={post.share}
                likedBy={post.likedBy}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedPosts;
