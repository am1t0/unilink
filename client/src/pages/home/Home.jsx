import React, { useEffect } from 'react';
import './home.css';
import Header from '../../components/header/Header';
import { Outlet } from 'react-router-dom';


const Home = () => {

  



  return (
    <div style={{ backgroundColor: '#131C35' }}>
      <Header />
      <Outlet />
    </div>
  );
};

export default Home;