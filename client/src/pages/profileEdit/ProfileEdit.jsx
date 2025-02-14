import React, { useState } from "react";
import "./profileedit.css";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore.";

const ProfileEdit = () => {
  const [loading, setLoading] = useState(false);
  const { updateProfile, authUser } = useAuthStore();
 
  const [profile, setProfile] = useState({
    name: authUser.name || "",
    collage: authUser.collage || "",
    degree: authUser.degree || "",
    branch: authUser.name || "",
    phone: authUser.phone || "",
    position: authUser.position || "",
    bio: authUser.bio || "",
    image: null,
  });


  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, image: file });
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRemoveImage = () => {
    setProfile({ ...profile, image: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageBase64 = null;

      if (profile.image) {
        imageBase64 = await convertFileToBase64(profile.image);
      }

      const updatedProfile = {
        ...profile,
        image: imageBase64, // Pass the base64 string instead of the File object
      };

      // Call the updateProfile function from useAuthStore
      await updateProfile(updatedProfile);
    } catch (error) {
      toast.error(
        error.message || "Something went wrong while updating the profile."
      );
    } finally {
      setLoading(false);
      setProfile({...profile, image: null});
    }
  };

  return (
    <div className="profile-edit-body">
      <div className="profile-edit-container">
        <h2 className="profile-edit-title">PROFILE EDIT</h2>
        <form onSubmit={handleSubmit} className="profile-edit-form">
          <label className="profile-edit-label">Name</label>
          <input
            type="text"
            name="name"
            className="profile-edit-input"
            placeholder="Enter your name"
            value={profile.name}
            onChange={handleChange}
          />

          <label className="profile-edit-label">Your Collage</label>
          <select
            name="collage"
            className="profile-edit-input"
            value={profile.collage}
            onChange={handleChange}
          >
            <option>Select Your Collage</option>
            <option>Collage A</option>
            <option>Collage B</option>
          </select>

          <label className="profile-edit-label">Degree</label>
          <select
            name="degree"
            className="profile-edit-input"
            value={profile.degree}
            onChange={handleChange}
          >
            <option>Select Your Degree</option>
            <option>Bachelor's</option>
            <option>Master's</option>
          </select>

          <label className="profile-edit-label">Branch</label>
          <select
            name="branch"
            className="profile-edit-input"
            value={profile.branch}
            onChange={handleChange}
          >
            <option>Select Your Branch</option>
            <option>Computer Science</option>
            <option>Electrical</option>
          </select>

          <label className="profile-edit-label">Phone Number</label>
          <input
            type="text"
            name="phone"
            className="profile-edit-input"
            placeholder="Enter your phone number"
            value={profile.phone}
            onChange={handleChange}
          />

          <label className="profile-edit-label">Your Position</label>
          <select
            name="position"
            className="profile-edit-input"
            value={profile.position}
            onChange={handleChange}
          >
            <option>Select Your Year</option>
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
            <option>4th Year</option>
          </select>

          <label className="profile-edit-label">Bio</label>
          <textarea
            name="bio"
            className="profile-edit-textarea"
            placeholder="Write something about yourself..."
            value={profile.bio}
            onChange={handleChange}
          ></textarea>

          <label className="profile-edit-label">Your Image</label>
          <div className="profile-edit-image-container">
            <div className="file-input-container">
              <input
                type="file"
                name="image"
                id="file-input"
                className="profile-edit-image-input"
                onChange={handleImageChange}
                accept="image/*"
              />
              <label htmlFor="file-input" className="custom-file-input">
                Choose an Image
              </label>
            </div>
            {profile.image && (
              <div className="image-preview-container">
                <img
                  src={URL.createObjectURL(profile.image)}
                  alt="Profile Preview"
                  className="profile-edit-image-preview"
                />
                <button
                  className="remove-image-button"
                  onClick={handleRemoveImage}
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <button className="profile-edit-btn" type="submit" disabled={loading}>
            {loading ? (
              <div className="profile-edit-loader">
                <Loader className="animate-spin" style={{ height: "18px" }} />{" "}
                Updating...
              </div>
            ) : (
              "Update Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
