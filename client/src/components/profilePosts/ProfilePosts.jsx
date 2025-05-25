import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../post/Post";
import './profilePosts.css';

export default function ProfilePosts({ posts, fetchMorePosts, hasMore }) {
  return (
    <div className="profile-posts-container">
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMorePosts}
        hasMore={hasMore}
        loader={<div className="profile-posts-infinite-scroll-loader">Loading...</div>}
        endMessage={<p className="profile-posts-no-more">No more posts</p>}
      >
        <div className="profile-posts-grid">
          {posts?.map((post) => (
            <div key={post._id} className="profile-post-item">
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
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}