import React, { useState } from "react";
import "./register.css";
import { Loader, RefreshCcw } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore.";

const Register = () => {
  const { registerUser, loading } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [collageName, setCollageName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const registerData = { email, password, name, collageName };

    const response = await registerUser(registerData);
    if (!response.success) {
      if (response.type === "validation") {
        toast.error(response.errors.join(", "));
      } else {
        toast.error(response.message);
      }
    } else {
      toast.success("Registration successful");
      navigate("/");
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setCollageName("");
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">REGISTER</h2>
        <p className="register-subtitle">
          Already have an account? <Link to="/login" className="link-login-link">Login</Link>
        </p>
        <form className="register-form" onSubmit={handleSubmit}>
          <label className="register-label">Name</label>
          <input type="text" className="register-input" placeholder="Enter your name" onChange={(e) => setName(e.target.value)} value={name} />

          <label className="register-label">Email ID</label>
          <input type="email" className="register-input" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} value={email} />

          <label className="register-label">Password</label>
          <input type="password" className="register-input" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} value={password} />

          <label className="register-label">Your College</label>
          <select className="register-select" onChange={(e) => setCollageName(e.target.value)} value={collageName}>
            <option value="">Select Your College</option>
            <option>IET-Davv</option>
            <option>LNCT Bhopal</option>
            <option>SGSITS Indore</option>
            <option>MIT Pune</option>
            <option>VIT Vellore</option>
            <option>SRM University</option>
            <option>Delhi Technological University</option>
            <option>Manipal Institute of Technology</option>
            <option>PES University</option>
            <option>KIIT Bhubaneswar</option>
          </select>

          <div className="register-buttons">
            <button type="submit" disabled={loading} className="register-btn-primary">{loading ? (<div className="login-loader"> <Loader className="animate-spin" style={{height:"18px"}}/> Creating.....</div> ): "Create Account"}</button>
            <div className="refresh-button"  onClick={handleReset}><RefreshCcw /></div>
          </div>

          <div className="register-icons">
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
