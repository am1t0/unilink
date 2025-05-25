import React, { useCallback, useEffect, useMemo } from 'react';
import './home.css';
import Header from '../../components/header/Header';
import { Outlet } from 'react-router-dom';
import { useSocket } from '../../providers/Socket';
import { useAuthStore } from '../../store/useAuthStore';
import NotificationCard from '../../components/notificationCard/NotificationCard';
import { useNotificationsStore } from '../../store/useNotifications';
import { useMessageStore } from '../../store/useMessageStore';
import Overlay from '../../components/overlay/Overlay';
import { useLinkStore } from '../../store/useLinkStore';


const Home = () => {

  
  const { authUser, changeLinkCount } = useAuthStore();
  const { socket } = useSocket();
  const { getNotification, getNotifications, sendMail } = useNotificationsStore();

  const { process } = useMessageStore(); 

  useEffect(()=>{
     console.log(socket.id);
  },[socket.id])
  //get all the notifications when user enters
  useEffect(()=>{
    getNotifications()
  },[getNotifications])

 const actionsOnNotification = useMemo(() => ({
    "Link-Accepted": changeLinkCount,
    "Like-Post": () => {},
    "Like-Comment": () => {},
    "Comment": () => {},
}), [changeLinkCount]);


  const handleNotificationGet = useCallback( async (notificationData) => {
    const { notificationId, type} = notificationData;
  
    // fetch the data of the notification sent and set state
    await getNotification(notificationId)

    actionsOnNotification[type]?.(type);
    
  }, [actionsOnNotification, getNotification]);


  const handleReceiverIsOffline = useCallback((notificationData) => {
    //if the receiver is offline, send a mail to the user
    notificationData.sender = authUser;
    sendMail(notificationData)
  }, [authUser, sendMail])

  useEffect(() => {
    socket.on("getNotification", handleNotificationGet);
    socket.on("receiverOffline", handleReceiverIsOffline);

    return () => {
      socket.off("getNotification");
      socket.off("receiverOffline");
    };
  }, [handleNotificationGet, handleReceiverIsOffline, socket]);

  return (
    <div id="home-page">
      <NotificationCard/>
      { process && <Overlay message = {process} />}
      <Header />
      <Outlet />
    </div>
  );
};

export default Home;