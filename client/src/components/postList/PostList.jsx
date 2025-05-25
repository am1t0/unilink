import React, { useEffect, useCallback } from "react";
import "./postList.css";
import Post from "../post/Post";
import { usePostStore } from "../../store/usePostStore";
import { useInView } from "react-intersection-observer";

export default function PostList() {
  const {
    getAllPosts,
    filteredPosts,
    currentPage,
    hasMore
  } = usePostStore();

  const { ref, inView } = useInView({
    threshold: 1
  });

  // Initial load
  useEffect(() => {
    getAllPosts(1, false);
  }, [getAllPosts]);

  // Fetch next page when scrolled into view
  useEffect(() => {
    if (inView && hasMore) {
      getAllPosts(currentPage + 1, true);
    }
  }, [inView, hasMore, currentPage, getAllPosts]);

  return (
    <ul className="post-list">
      {filteredPosts?.map((post, index) => (
        <Post
          key={post._id}
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
      ))}
      {/* Loader trigger */}
      {hasMore && <div ref={ref} className="loading">Loading more...</div>}
    </ul>
  );
}
