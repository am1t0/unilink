import React, { useState } from "react";
import "../../../style/auth/RegisterPage1.css";
import "../../../style/common/mode.css";

const RegisterPage1 = ({ handleNext }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Proceed to the next page with form data
    handleNext(formData);
  };

  return (
    <div className="registerpage1-container">
      <h1 className="registerpage1-title">Register - Basic Info</h1>
      <form onSubmit={handleSubmit} className="registerpage1-form">
        <label htmlFor="name" className="registerpage1-label">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="registerpage1-input"
        />

        <label htmlFor="email" className="registerpage1-label">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="registerpage1-input"
        />

        <label htmlFor="password" className="registerpage1-label">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="registerpage1-input"
        />

        <label htmlFor="gender" className="registerpage1-label">Gender:</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="registerpage1-select"
        >
          <option value="">Select Gender</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="O">Other</option>
        </select>

        <button type="submit" className="registerpage1-button">Next</button>
      </form>
    </div>
  );
};

export default RegisterPage1;
