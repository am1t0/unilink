import React, { useState } from 'react';
import "./editProfileForm.css";
import { useAuthStore } from '../../store/useAuthStore';
import { BsX } from 'react-icons/bs';

const EditProfileForm = ({ isOpen, onClose }) => {
  const { authUser, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    name: authUser?.name || '',
    bio: authUser?.bio || '',
    collage: authUser?.collage || '',
    branch: authUser?.branch || '',
    degree: authUser?.degree || '',
    year: authUser?.year || 'I',
    phone: authUser?.phone || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="edit-profile-overlay">
      <div className="edit-profile-modal">
        <button className="close-button" onClick={onClose}>
          <BsX size={24} />
        </button>
        
        <h2>Edit Profile</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write something about yourself"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>College</label>
              <input
                type="text"
                name="collage"
                value={formData.collage}
                onChange={handleChange}
                placeholder="Your college"
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Branch</label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                placeholder="Your branch"
              />
            </div>

            <div className="form-group">
              <label>Degree</label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="Your degree"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Year</label>
            <select name="year" value={formData.year} onChange={handleChange}>
              <option value="I">I Year</option>
              <option value="II">II Year</option>
              <option value="III">III Year</option>
              <option value="IV">IV Year</option>
              <option value="V">V Year</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;
