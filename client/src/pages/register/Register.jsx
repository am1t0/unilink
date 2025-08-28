import React, { useState, useRef, useEffect } from "react";
import "./register.css";
import { Loader, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";

const Register = () => {
  const { sendOtp, verifyOtp, loading } = useAuthStore();

  // User registration states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  // Load saved registration data (if any) from sessionStorage
  useEffect(() => {
    const savedData = sessionStorage.getItem("registrationData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setStep(parsed.step || 1);
      setEmail(parsed.email || "");
      setCollege(parsed.college || "");
    }

    // Check existing OTP expiry
    const expiry = sessionStorage.getItem("otpExpiry");
    if (expiry) {
      const remaining = Math.floor((parseInt(expiry) - Date.now()) / 1000);
      if (remaining > 0) startTimer(remaining);
      else setTimer(0); // expired
    }
  }, []);

  // Timer function
  const startTimer = (seconds) => {
    setTimer(seconds);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          sessionStorage.removeItem("otpExpiry");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

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

        {/* Step 1: Email & College */}
        {step === 1 && (
          <form className="register-form" onSubmit={(e) => e.preventDefault()}>
            <label className="register-label">College Email</label>
            <input
              type="email"
              className="register-input"
              placeholder="Enter your college email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="register-label">Your College</label>
            <select
              className="register-select"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            >
              <option value="">Select Your College</option>
              <option>Institute of Engineering and Technology, DAVV</option>
              {/* Add more colleges */}
            </select>

            <button
              type="button"
              className="register-btn-primary"
              disabled={loading}
              onClick={()=> sendOtp({email, college, step:2}, setStep, startTimer)}
            >
              {loading ? (
                <div className="login-loader">
                  <Loader className="animate-spin" style={{ height: "18px" }} />{" "}
                  Sending OTP...
                </div>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <>
            <div className="register-otp-timer">
              {timer > 0 ? (
                <p>OTP expires in: {timer}s</p>
              ) : (
                <button className="resend-otp-btn" onClick={()=> sendOtp({email, college, step: 2}, setStep, startTimer)}>
                  Resend OTP
                </button>
              )}
            </div>

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
                    if (val && i < 3)
                      document.getElementById(`otp-box-${i + 1}`)?.focus();
                    if (!val && i > 0)
                      document.getElementById(`otp-box-${i - 1}`)?.focus();
                  }}
                  disabled={timer <= 0}
                />
              ))}
              <button
                type="button"
                className="register-btn-primary"
                style={{ marginLeft: 16 }}
                disabled={timer <= 0 || otp.join("").length !== 4}
                onClick={() => verifyOtp({ email, college, otp: otp.join("") }, setStep)}
              >
                {loading ? (
                  <Loader className="animate-spin" style={{ height: "18px" }} />
                ) : (
                  "Verify OTP"
                )}
              </button>
            </div>
          </>
        )}

        {/* Step 3: User Details */}
        {step === 3 && (
          <form className="register-form" onSubmit={(e) => e.preventDefault()}>
            <label className="register-label">Name</label>
            <input
              type="text"
              className="register-input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label className="register-label">Password</label>
            <input
              type="password"
              className="register-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="register-btn-primary"
            >
              {loading ? (
                <Loader className="animate-spin" style={{ height: "18px" }} />
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
