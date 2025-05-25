import React, { useState } from "react";
import "./profileCard.css";
import {
  BsArrow90DegRight,
  BsBook,
  BsBuilding,
  BsMessenger,
  BsNut,
  BsPerson,
  BsCamera,
  BsMortarboardFill,
  BsPencil,
} from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-hot-toast";
import EditProfileForm from "../editProfileForm/EditProfileForm";
import defaultAvatar from '../../assets/images/avatar.png'
import Overlay from "../common/overlay/Overlay";
import Links from "../links/Links";

export default function ProfileCard({ user }) {
  const { uploadProfileImage, uploadBannerImage, authUser } = useAuthStore();
  const { profileId } = useParams();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [linksShow, setLinksShow] = useState(false);

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size should be less than 2MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      await uploadBannerImage(file);
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 1MB)
      if (file.size > 1024 * 1024) {
        toast.error("File size should be less than 1MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      await uploadProfileImage(file);
    }
  };

  const isOwnProfile = () => {
    return !profileId || authUser._id === profileId;
  };

  const handleEditClick = () => {
    setIsEditFormOpen(true);
  };


 

  return (
    <>
      <div className="profile-card">
        <div
          className="profile-header"
          style={{
            backgroundImage: user?.banner ? `url(${user.banner})` : "none",
            backgroundColor: !user?.banner ? "#01112a" : "transparent",
          }}
        >
          {isOwnProfile() && (
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
          )}

          <div className="profile-image-container">
            <img
              src={user?.avatar || defaultAvatar}
              alt="Profile"
              className="profile-image"
            />
            {isOwnProfile() && (
              <label className="profile-image-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                />
                <div className="profile-upload-overlay">
                  <BsCamera className="camera-icon" />
                </div>
              </label>
            )}
          </div>
        </div>

        <div className="profile-info-container">
          <div className="profile-info">
            <h3 className="profile-name">{user?.name || "Add Name"}</h3>
            <p className="profile-bio">{user?.bio || "Add bio..."}</p>

            <div className="profile-details">
              <div className="profile-institute">
                <BsBuilding className="icon" />
                <p>{user?.collage || "Add College"}</p>
              </div>
              <div className="profile-course">
                <BsBook className="icon" />
                <p>{user?.branch || "Add Course"}</p>
              </div>
              <div className="profile-degree">
                <BsMortarboardFill className="icon" />
                <p>{user?.degree || "Add Degree"}</p>
              </div>
            </div>
          </div>

          <div className="connection-info">
            <div className="first-row">
              {!isOwnProfile() && (
                <>
                  <button>
                    <BsPerson className="icon" />
                    <p>Connect</p>
                  </button>
                  <button>
                    <BsMessenger className="icon" />
                    <p>Message</p>
                  </button>
                </>
              )}

              {isOwnProfile() && (
                <>
                  <BsPencil
                    id="profile-edit"
                    className="icon"
                    onClick={handleEditClick}
                  />
                  <BsNut id="profile-setting" className="icon" />
                </>
              )}
            </div>

            <div className="second-row" onClick={()=> setLinksShow(!linksShow)}>
              <div className="connections-imgs">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ718nztPNJfCbDJjZG8fOkejBnBAeQw5eAUA&s"
                  alt=""
                />
                <img
                  src="https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg"
                  alt=""
                />
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
              <span>{`${user.linksCount} links` || 'No links yet'}</span>
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

      <EditProfileForm
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        user={user}
        show={isEditFormOpen}
        setShow= {setIsEditFormOpen}
      />

      <Overlay 
        show={linksShow} 
        setShow={setLinksShow}
        heading={"Links"}
       >
        <Links/>
      </Overlay>
    </>
  );
}
