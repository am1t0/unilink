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
import { usePostStore } from '../../store/usePostStore';
import { useCommentStore } from '../../store/useCommentStore';


const Home = () => {

  
  const { socket } = useSocket();
  const { updateCommentLikeCount } = useCommentStore();
  const { authUser, changeLinkCount } = useAuthStore();
  const { updatePostLikeCount, commentCountIncrement } = usePostStore();
  const { getNotification, getNotifications, sendMail } = useNotificationsStore();

  const { process } = useMessageStore(); 

  //get all the notifications when user enters
  useEffect(()=>{
    getNotifications()
  },[getNotifications])

 const actionsOnNotification = useMemo(() => ({
    "Link-Accepted": changeLinkCount,
    "Post-Like": updatePostLikeCount,
    "Comment-Like": updateCommentLikeCount,
    "Comment": commentCountIncrement,
}), [changeLinkCount, commentCountIncrement, updateCommentLikeCount, updatePostLikeCount]);


  const handleNotificationGet = useCallback( async (notificationData) => {
    const { notificationId, type} = notificationData;
  
    // fetch the data of the notification sent and set state
    await getNotification(notificationId)

    actionsOnNotification[type]?.(notificationData);
    
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
     <center>
      <h2>In case of negative response decrease the parameters</h2>
      </center> 
      <Outlet />
    </div>
  );
};

export default Home;