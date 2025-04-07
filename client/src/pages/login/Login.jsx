import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast"
import { useAuthStore } from "../../store/useAuthStore";
import { Loader } from "lucide-react";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {loginUser,loading} = useAuthStore()
  const navigate = useNavigate();

  //form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = { email, password };

    const response = await loginUser(loginData); // Call loginUser
    if (!response.success) {
      if (response.type === "validation") {
        // Handle validation errors
        toast.error(response.errors.join(", ")); // Combine all validation error messages
      } else {
        // Handle other errors (API or generic)
        toast.error(response.message);
      }
    } else {
      // Login successful
      toast.success("Login successful");
      navigate("/");
    }
  }

  return (
    <div className="login-body">
      <div className="login-container">
        <h2 className="login-title">LOGIN</h2>
        <p className="login-register-text">don't have an account? <Link to="/register" className="link-login-link">register</Link></p>

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

        <button className="login-btn-primary" type="submit" disabled={loading}>{loading ?(<div className="login-loader"> <Loader className="animate-spin" style={{height:"18px"}}/> Loging in.....</div> ): "Login"}</button>
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
