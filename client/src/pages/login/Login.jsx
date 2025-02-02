import React from "react";
import "./login.css";
import { Link } from "react-router-dom";
const Login = () => {
  return (
    <div className="login-body">
      <div className="login-container">
        <h2 className="login-title">LOGIN</h2>
        <p className="login-register-text">don't have an account? <Link to="/register" className="link-login-link">register</Link></p>

        <label htmlFor="email" className="login-label">
          Email ID
        </label>
        <input
          type="email"
          id="email"
          className="login-input"
          placeholder="Enter your email"
        />

        <label htmlFor="password" className="login-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="login-input"
          placeholder="Enter your password"
        />

        <button className="login-btn-primary">Login</button>

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
