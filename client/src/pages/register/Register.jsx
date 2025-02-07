import React, { useState } from "react";
import "./register.css";
import { useAuthStore } from "../../store/useAuthStore.";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const {registerUser} = useAuthStore()
  const [name, setName] = useState("");
	const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
	const [password, setPassword] = useState("");
	const [collageName, setCollageName] = useState("");
  const navigate = useNavigate();

    //form submission for login
  const handleSubmit = async (e) => {
      e.preventDefault();
      const registerData = { email, password , name, collageName};
  
      const response = await registerUser(registerData); // Call loginUser
      if (!response.success) {
        if (response.type === "validation") {
          // Handle validation errors
          setErrorMessage(response.errors.join(", ")); // Combine all validation error messages
        } else {
          // Handle other errors (API or generic)
          setErrorMessage(response.message);
        }
      } else {
        // Login successful
        navigate("/");
      }
  }

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">REGISTER</h2>
        <p className="register-subtitle">
          Already have an account <Link to="/login" className="register-login">login</Link>
        </p>

         {/* Error Message */}
         {errorMessage && <p className="error-message">*{errorMessage}</p>}

        <form className="register-form" onSubmit={handleSubmit}>
          <label className="register-label">Name</label>
          <input type="text" className="register-input" onChange={(e) => setName(e.target.value)} value={name}/>

          <label className="register-label">Email ID</label>
          <input type="email" className="register-input" onChange={(e) => setEmail(e.target.value)} value={email} />

          <label className="register-label">Password</label>
          <input type="password" className="register-input" onChange={(e) => setPassword(e.target.value)} value={password}/>

          <label className="register-label">Your College</label>
          <select className="register-select" onChange={(e) => setCollageName(e.target.value)} value={collageName}>
            <option>Select Your College</option>
            <option>IET-Davv</option>
          </select>

          <button type="submit" className="register-btn-primary">
            Create Account
          </button>

          <div className="register-icons">
            <div className="register-refresh">🔄</div>
            <div className="register-circle"></div>
            <div className="register-circle"></div>
            <div className="register-circle"></div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
