import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {loginUser} = useAuthStore()
  const navigate = useNavigate();

  //form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = { email, password };

    const response = await loginUser(loginData); // Call loginUser
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
    <div className="login-body">
      <div className="login-container">
        <h2 className="login-title">LOGIN</h2>
        <p className="login-register-text">don't have an account? <Link to="/register" className="link-login-link">register</Link></p>
         
          {/* Error Message */}
        {errorMessage && <p className="error-message">*{errorMessage}</p>}

        <form onSubmit={handleSubmit}>
        <label htmlFor="email" className="login-label">
          Email ID
        </label>
        <input
          type="email"
          id="email"
          className="login-input"
          placeholder="Enter your email"
          value={email}
          onChange={e=> setEmail(e.target.value)}
        />

        <label htmlFor="password" className="login-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="login-input"
          placeholder="Enter your password"
          value={password}
          onChange={e=> setPassword(e.target.value)}
        />

        <button className="login-btn-primary" type="submit">Login</button>
        </form>

        {/* <div className="login-box-container">
          <div className="login-small-box"></div>
          <div className="login-small-box"></div>
          <div className="login-small-box"></div>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
