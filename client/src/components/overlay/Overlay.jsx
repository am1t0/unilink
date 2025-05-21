import React from 'react';
import './overlay.css';
import Loader from '../loader/Loader';

export default function Overlay({ message = "Loading..."}) {
  return (
    <div className="overlay-container">
      <div className="overlay-content">
        <Loader/>
        <p>{message}</p>
      </div>
    </div>
  );
}
