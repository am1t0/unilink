import React, { useEffect } from 'react';
import './home.css';
import Header from '../../components/header/Header';
import { Outlet } from 'react-router-dom';
import Post from '../../components/post/Post';
import { usePostStore } from '../../store/usePostStore';
import Recommendations from '../../components/recommendations/Recommendations';

const Home = () => {
  const { getAllPosts, posts } = usePostStore();

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);
  



  return (
    <div style={{ backgroundColor: '#131C35' }}>
      <Header />
      <Outlet />
    </div>
  );
};

export default Home;