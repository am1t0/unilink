import React, { useEffect } from 'react';
import './home.css';
import Header from '../../components/header/Header';
import { Outlet } from 'react-router-dom';
import Post from '../../components/post/Post';
import { usePostStore } from '../../store/usePostStore';

const Home = () => {
  const { getAllPosts, posts } = usePostStore();

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);
  console.log(posts);
  

  return (
    <div style={{ backgroundColor: '#131C35' }}>
      <Header />
      <Outlet />
      {posts?.map((post) => (
        <Post
          key={post._id}
          postId={post._id}
          mediaArray={post.media} 
          description={post.description} 
          createdAt={post.createdAt}
          user={post.user}
          likeCount = {post.likeCount}
          commentCount = {post.commentCount}
          share = {post.share}
          likedBy = {post.likedBy}
        />
      ))}
    </div>
  );
};

export default Home;