import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import DefaultAvatar from '../../assets/images/avatar.png';
import './addPostBar.css';

export default function AddPostBar() {
  const { authUser } = useAuthStore();

  return (
    <div className="add-post-bar">
      <img
        src={authUser.avatar || DefaultAvatar}
        alt="User Avatar"
        className="avatar"
      />
      <button className="post-button">Share your thoughts...</button>
    </div>
  );
}
