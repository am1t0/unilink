import React, { useEffect } from 'react';
import './home.css';
import Header from '../../components/header/Header';
import { Outlet } from 'react-router-dom';
import { useSocket } from '../../providers/Socket';
import { useAuthStore } from '../../store/useAuthStore';
import NotificationCard from '../../components/notificationCard/NotificationCard';
import { useNotificationsStore } from '../../store/useNotifications';


const Home = () => {

  const { authUser } = useAuthStore();
  const { socket } = useSocket();
  const { getNotification } = useNotificationsStore();

  useEffect(()=>{
       socket.emit("addUser", authUser._id )
  },[authUser._id, socket])
  
  useEffect(() => {
    
    socket.on("getNotification", (notificationData) => {
      const { notificationId } = notificationData;
      
      // fetch the data of the notification sent and set state
      getNotification(notificationId);
    })

    return () => {
      socket.off("getNotification");
    }

  },[getNotification, socket])


  return (
    <div>
      <NotificationCard/>
      <Header />
      <Outlet />
    </div>
  );
};

export default Home;