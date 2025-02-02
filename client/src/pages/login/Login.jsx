import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {loginUser} = useAuthStore()
  const navigate = useNavigate();
  return (
    <div className="login-body">
      <div className="login-container">
        <h2 className="login-title">LOGIN</h2>
        <p className="login-register-text">don't have an account? <Link to="/register" className="link-login-link">register</Link></p>

        <form onSubmit={e=>{
          e.preventDefault();
          loginUser({email, password})
          .then(()=> navigate('/'));
        }}>
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
