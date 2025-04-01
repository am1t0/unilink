import React, { useState } from "react";
import "./profileCard.css";
import {
  BsArrow90DegRight,
  BsBook,
  BsBuilding,
  BsCapslock,
  BsMessenger,
  BsNut,
  BsPerson,
  BsCamera
} from "react-icons/bs";

export default function ProfileCard() {
  const [bannerImage, setBannerImage] = useState(null);
  const name = "Amit Pandey";
  const year = "III";
  const bio =
    "DSA || OOPS || OS || DBMS || C, JAVA, JS || MERN stack || AWS , NGINX || Cloud || Kubernates, Docker, Ansible";
  const institute = "Institute of Engineering and Technology , DAVV ,Indore";
  const course = "Information and Technology";
  const profileImage = `https://api.dicebear.com/6.x/avataaars/svg?seed=rahul`;

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setBannerImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-card">
      <div
        className="profile-header"
        style={{
          backgroundImage: bannerImage ? `url(${bannerImage})` : "none",
        }}
      >
        <label className="banner-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleBannerUpload}
          />
          <div className="upload-overlay">
            <BsCamera className="camera-icon" />
            <span>Upload Banner</span>
          </div>
        </label>
      </div>

      <div className="profile-info-container">
        <div className="profile-info">
          <img src={profileImage} alt="Profile" className="profile-image" />
          <h3 className="profile-name">
            {name}
            <span className={`year-tag year-${year.toLowerCase()}`}>
              {year} Year
            </span>
          </h3>
          <p className="profile-bio">{bio}</p>
          <div className="profile-details">
            <div className="profile-institute">
              <BsBuilding className="icon" />
              <p>{institute}</p>
            </div>
            <div className="profile-course">
              <BsBook className="icon" />
              <p>{course}</p>
            </div>
          </div>
        </div>

        <div className="connection-info">
          <div className="first-row">
            <button>
              <BsPerson className="icon" />
              <p>Connect</p>
            </button>

            <button>
              <BsMessenger className="icon" />
              <p>Message</p>
            </button>

            <BsNut id="profile-setting" className="icon" />
          </div>

          <div className="second-row">
            <div className="connections-imgs">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ718nztPNJfCbDJjZG8fOkejBnBAeQw5eAUA&s"
                alt=""
              />
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg"
                alt=""
              />
              <img src={profileImage} alt="" />
              <img
                src="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
                alt=""
              />
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg"
                alt=""
              />
              <BsArrow90DegRight />
            </div>
            <span>400+ Connections</span>
          </div>

          <div className="third-row">
            <div className="posts-imgs">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1AKF7LelsXtbK8YAYYdiPrDMZdFd74ZTgkQ&s"
                alt=""
              />
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg"
                alt=""
              />
              <img src={profileImage} alt="" />
              <img
                src="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
                alt=""
              />
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg"
                alt=""
              />
              <BsArrow90DegRight />
            </div>
            <span>5+ Posts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
