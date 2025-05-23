import React, { useEffect, useRef, useState } from "react";
import "./editProfileForm.css";
import { useAuthStore } from "../../store/useAuthStore";
import { BsX } from "react-icons/bs";

const EditProfileForm = (props) => {
  const { show, setShow } = props;

  //user details from store
  const { authUser, updateProfile } = useAuthStore();

  //data in profile
  const [formData, setFormData] = useState({
    name: authUser?.name || "",
    bio: authUser?.bio || "",
    collage: authUser?.collage || "",
    branch: authUser?.branch || "",
    degree: authUser?.degree || "",
    position: authUser?.position || "I",
    phone: authUser?.phone || "",
  });

  const [loading, setLoading] = useState(false);
  const boxRef = useRef();

  //closing the component on click outside
  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setShow(!show);
      }
    };

    if (show) document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShow, show]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateProfile(formData);
    setLoading(false);
    setShow(!show);
  };

  if (!show) return null;

  return (
    <div className="edit-profile-overlay">
      <div className="edit-profile-modal" ref={boxRef}>
        <div className="edit-profile-header">
          <h2>Edit Profile</h2>

          <button className="close-button" onClick={()=> setShow(!show)}>
            <BsX size={24} />
          </button>
        </div>

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
              <select
                name="collage"
                value={formData.collage}
                onChange={handleChange}
              >
                <option value="">Select College</option>
                <option value="Institute of Engineering and Technology, DAVV">
                  Institute of Engineering and Technology, DAVV
                </option>
                <option value="Shri Govindaram Seksariya Institute of Technology">
                  Shri Govindaram Seksariya Institute of Technology
                </option>
              </select>
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
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
              >
                <option value="">Select Branch</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information and Technology">
                  Information and Technology
                </option>
                <option value="Mechanical Engineering">
                  Mechanical Engineering
                </option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>

            <div className="form-group">
              <label>Degree</label>
              <select
                name="degree"
                value={formData.degree}
                onChange={handleChange}
              >
                <option value="">Select Degree</option>
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="B.Sc">B.Sc</option>
                <option value="M.Sc">M.Sc</option>
                <option value="PhD">PhD</option>
              </select>
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
            <button type="button" className="cancel-btn" onClick={()=> setShow(!show)}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;
