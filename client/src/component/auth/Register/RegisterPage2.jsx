import React, { useState } from "react";
import "../../../style/auth/RegisterPage2.css";
import "../../../style/common/mode.css";

const RegisterPage2 = ({ formData, handleBack, handleSubmit }) => {
  const [additionalData, setAdditionalData] = useState({
    phone_number: "",
    profileImg: "",
    bio: "",
    college_name: "",
    degree: "",
    dob: "",
    city: "",
    address: "",
    role: ""
  });

  const handleChange = (e) => {
    setAdditionalData({ ...additionalData, [e.target.name]: e.target.value });
  };

  const submitForm = (e) => {
    e.preventDefault();
    // Combine both page data and submit
    handleSubmit({ ...formData, ...additionalData });
  };

  return (
    <div className="registerpage2-container">
      <h1 className="registerpage2-title">Register - Additional Info</h1>
      <form onSubmit={submitForm} className="registerpage2-form">
        <label htmlFor="phone_number" className="registerpage2-label">Phone Number:</label>
        <input
          type="tel"
          id="phone_number"
          name="phone_number"
          value={additionalData.phone_number}
          onChange={handleChange}
          required
          className="registerpage2-input"
        />

        <label htmlFor="profileImg" className="registerpage2-label">Profile Image URL:</label>
        <input
          type="file"
          id="profileImg"
          name="profileImg"
          value={additionalData.profileImg}
          onChange={handleChange}
          className="registerpage2-input"
        />

        <label htmlFor="bio" className="registerpage2-label">Bio:</label>
        <input
          type="text"
          id="bio"
          name="bio"
          value={additionalData.bio}
          onChange={handleChange}
          className="registerpage2-input"
        />

        <label htmlFor="college_name" className="registerpage2-label">College Name:</label>
        <input
          type="text"
          id="college_name"
          name="college_name"
          value={additionalData.college_name}
          onChange={handleChange}
          required
          className="registerpage2-input"
        />

        <label htmlFor="degree" className="registerpage2-label">Degree:</label>
        <input
          type="text"
          id="degree"
          name="degree"
          value={additionalData.degree}
          onChange={handleChange}
          required
          className="registerpage2-input"
        />

        <label htmlFor="dob" className="registerpage2-label">Date of Birth:</label>
        <input
          type="date"
          id="dob"
          name="dob"
          value={additionalData.dob}
          onChange={handleChange}
          required
          className="registerpage2-input"
        />

        <label htmlFor="city" className="registerpage2-label">City:</label>
        <input
          type="text"
          id="city"
          name="city"
          value={additionalData.city}
          onChange={handleChange}
          required
          className="registerpage2-input"
        />

        <label htmlFor="address" className="registerpage2-label">Address:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={additionalData.address}
          onChange={handleChange}
          required
          className="registerpage2-input"
        />

        <label htmlFor="role" className="registerpage2-label">Register as:</label>
        <select
          id="role"
          name="role"
          value={additionalData.role}
          onChange={handleChange}
          required
          className="registerpage2-select"
        >
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="alumni">Alumni</option>
        </select>

        <button type="button" onClick={handleBack} className="registerpage2-button">Back</button>
        <button type="submit" className="registerpage2-button">Submit</button>
      </form>
    </div>
  );
};

export default RegisterPage2;
