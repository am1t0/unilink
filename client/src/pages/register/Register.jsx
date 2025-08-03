import React, { useState, useRef } from "react";
import "./register.css";
import { Loader, RefreshCcw } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";

const Register = () => {
  const { registerUser, loading } = useAuthStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [collageName, setCollageName] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showOtpBoxes, setShowOtpBoxes] = useState(false);
  const [timer, setTimer] = useState(60);
  const timerRef = useRef();
  const navigate = useNavigate();

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">REGISTER</h2>
        <p className="register-subtitle">
          Already have an account? <Link to="/login" className="link-login-link">Login</Link>
        </p>
        {step === 1 && (
          <form className="register-form" onSubmit={()=> {}}>
            <label className="register-label">College Email</label>
            <input type="email" className="register-input" placeholder="Enter your college email" onChange={(e) => setEmail(e.target.value)} value={email} />
            <label className="register-label">Your College</label>
            <select className="register-select" onChange={(e) => setCollageName(e.target.value)} value={collageName}>
              <option value="">Select Your College</option>
              <option>Institute of Engineering and Technology, DAVV</option>
              {/* Add more colleges here */}
            </select>
            {!showOtpBoxes ? (
              <div className="register-buttons">
                <button type="submit" disabled={loading} className="register-btn-primary">{loading ? (<div className="login-loader"> <Loader className="animate-spin" style={{height:"18px"}}/> Sending OTP...</div> ): "Send OTP"}</button>
                <div className="refresh-button"  onClick={()=> {}}><RefreshCcw /></div>
              </div>
            ) : (
              <>
                <div className="register-otp-timer" style={{marginBottom:8}}>OTP expires in: {timer}s</div>
                <div className="register-otp-row" style={{display:'flex',justifyContent:'center',gap:'16px',marginBottom:'16px'}}>
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={i}
                      id={`otp-box-${i}`}
                      type="text"
                      className="register-otp-box"
                      style={{width:'40px',height:'40px',textAlign:'center',fontSize:'20px',border:'1px solid #ccc',borderRadius:'6px'}}
                      maxLength={1}
                      value={otp[i]}
                      onChange={(e) => {}}
                      disabled={timer === 0}
                    />
                  ))}
                  <button type="button" className="register-btn-primary" style={{marginLeft:16}} onClick={()=> {}} disabled={timer === 0 || otp.join("").length !== 4}>{loading ? (<Loader className="animate-spin" style={{height:"18px"}}/> ): "Verify OTP"}</button>
                </div>
                <div className="refresh-button"  onClick={()=> {}}><RefreshCcw /></div>
              </>
            )}
          </form>
        )}
        {step === 2 && (
          <form className="register-form" onSubmit={()=> {}}>
            <label className="register-label">Name</label>
            <input type="text" className="register-input" placeholder="Enter your name" onChange={(e) => setName(e.target.value)} value={name} />
            <label className="register-label">Password</label>
            <input type="password" className="register-input" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} value={password} />
            <div className="register-buttons">
              <button type="submit" disabled={loading} className="register-btn-primary">{loading ? (<div className="login-loader"> <Loader className="animate-spin" style={{height:"18px"}}/> Creating.....</div> ): "Create Account"}</button>
              <div className="refresh-button"  onClick={()=> {}}><RefreshCcw /></div>
            </div>
          </form>
        )}
        <div className="register-icons">
          <div className="register-circle"></div>
          <div className="register-circle"></div>
          <div className="register-circle"></div>
        </div>
      </div>
    </div>
  );
};

export default Register;
