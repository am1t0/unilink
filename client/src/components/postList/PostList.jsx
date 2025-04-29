import React, { useEffect } from "react";
import "./postList.css";
import Post from "../post/Post";
import { usePostStore } from "../../store/usePostStore";

export default function PostList() {
  const { getAllPosts, filteredPosts } = usePostStore();

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  return (
    <ul className="post-list">
      {filteredPosts?.map((post) => (
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
    </ul>
  );
}
