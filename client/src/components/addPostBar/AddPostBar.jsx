import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import DefaultAvatar from '../../assets/images/avatar.png';
import './addPostBar.css';
import { useNavigate } from 'react-router';

export default function AddPostBar() {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="add-post-bar">
      <img
        src={authUser.avatar || DefaultAvatar}
        alt="User Avatar"
        className="avatar"
      />
      <button className="post-button" onClick={() => navigate('/post-create')}>Share your thoughts...</button>
    </div>
  );
}
