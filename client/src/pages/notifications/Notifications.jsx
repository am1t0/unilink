import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaComment,
  FaAt,
  FaUserPlus,
} from "react-icons/fa";
import "./notifications.css";
import { useNotificationsStore } from "../../store/useNotifications";
import { useLinkStore } from "../../store/useLinkStore";
import { useSocket } from "../../providers/Socket";
import toast from "react-hot-toast";
import List from "../../components/notification/list/List";
import FilterBar from "../../components/notification/filterBar/FilterBar";


const iconMap = {
  Like: <FaHeart className="icon like" />,
  Comment: <FaComment className="icon comment" />,
  Mention: <FaAt className="icon mention" />,
  Follow: <FaUserPlus className="icon follow" />,
};

export default function Notifications() {
  
  return (
      <div id="notification-page">
         <FilterBar/>
         <List/>
      </div>
  );
}
