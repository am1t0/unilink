import React, { useState, useRef, useEffect } from "react";
import "./register.css";
import { Loader, RefreshCcw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";

const Register = () => {
  const { registerUser, sendOtp, verifyOtp, loading } = useAuthStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [college, setCollege] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showOtpBoxes, setShowOtpBoxes] = useState(true);
  const [timer, setTimer] = useState(120);
  const timerRef = useRef(null);

  // Live timer effect
  useEffect(() => {
    if (showOtpBoxes) {
      setTimer(120);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showOtpBoxes]);

  // Stop timer on step change
  useEffect(() => {
    if (step !== 1 && timerRef.current) clearInterval(timerRef.current);
  }, [step]);
  const navigate = useNavigate();

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">REGISTER</h2>
        <p className="register-subtitle">
          Already have an account?{" "}
          <Link to="/login" className="link-login-link">
            Login
          </Link>
        </p>
        {step === 1 && (
          <form className="register-form" onSubmit={() => {}}>
            <label className="register-label">College Email</label>
            <input
              type="email"
              className="register-input"
              placeholder="Enter your college email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <label className="register-label">Your College</label>
            <select
              className="register-select"
              onChange={(e) => setCollege(e.target.value)}
              value={college}
            >
              <option value="">Select Your College</option>
              <option>Institute of Engineering and Technology, DAVV</option>
              {/* Add more colleges here */}
            </select>

            <button
              type="button"
              disabled={loading}
              className="register-btn-primary"
              onClick={(e) => {
                e.preventDefault();
                sendOtp({ email, college }, setShowOtpBoxes);
              }}
            >
              {loading ? (
                <div className="login-loader">
                  {" "}
                  <Loader
                    className="animate-spin"
                    style={{ height: "18px" }}
                  />{" "}
                  Sending OTP...
                </div>
              ) : (
                "Send OTP"
              )}
            </button>
            <div className="refresh-button">
              <RefreshCcw />
            </div>
          </form>
        )}
        {step === 2 && (
          <>
           <div className="register-otp-timer">OTP expires in: {timer}s</div>
                <div className="register-otp-row">
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={i}
                      id={`otp-box-${i}`}
                      type="text"
                      className="register-otp-box"
                      maxLength={1}
                      value={otp[i]}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9a-z]/g, "").toLowerCase();
                        const newOtp = [...otp];
                        newOtp[i] = val;
                        setOtp(newOtp);
                        // Focus next box if value entered
                        if (val && i < 3) {
                          document.getElementById(`otp-box-${i+1}`)?.focus();
                        }
                        // Focus previous box if deleted
                        if (!val && i > 0) {
                          document.getElementById(`otp-box-${i-1}`)?.focus();
                        }
                      }}
                      disabled={timer === 0}
                    />
                  ))}
                  <button type="button" className="register-btn-primary" style={{marginLeft:16}} onClick={(e)=> {e.preventDefault(); verifyOtp({email, college, otp: otp.join("")}, setShowOtpBoxes, setStep) }} disabled={timer === 0 || otp.join("").length !== 4}>{loading ? (<Loader className="animate-spin" style={{height:"18px"}}/> ): "Verify OTP"}</button>
                </div>
                <div className="refresh-button"  onClick={(e)=> {}}><RefreshCcw /></div>
           </>
        )}
        {step === 2 && (
          <form className="register-form" onSubmit={() => {}}>
            <label className="register-label">Name</label>
            <input
              type="text"
              className="register-input"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <label className="register-label">Password</label>
            <input
              type="password"
              className="register-input"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <div className="register-buttons">
              <button
                type="submit"
                disabled={loading}
                className="register-btn-primary"
              >
                {loading ? (
                  <div className="login-loader">
                    {" "}
                    <Loader
                      className="animate-spin"
                      style={{ height: "18px" }}
                    />{" "}
                    Creating.....
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
              <div className="refresh-button" onClick={() => {}}>
                <RefreshCcw />
              </div>
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
