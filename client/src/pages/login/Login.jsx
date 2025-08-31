import React, { useEffect, useRef, useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";
import { Loader } from "lucide-react";
const Login = () => {
  //auth user states
  const { verifyOtp, sendOtp, loginUser, loading } = useAuthStore();

  //user login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginWay, setLoginWay] = useState(2);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  const navigate = useNavigate();

  // Load saved registration data (if any) from sessionStorage
  useEffect(() => {
    const savedData = sessionStorage.getItem("loginData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setLoginWay(parsed.step || 1);
      setEmail(parsed.email || "");
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
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <h2 className="login-title">LOGIN</h2>
        <p className="login-register-text">
          don't have an account?{" "}
          <Link to="/register" className="link-login-link">
            register
          </Link>
        </p>
        {loginWay === 1 && (
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="login-btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="login-loader">
                  {" "}
                  <Loader
                    className="animate-spin"
                    style={{ height: "18px" }}
                  />{" "}
                  Loging in.....
                </div>
              ) : (
                "Login"
              )}
            </button>
            <p className="forgot-passwored" onClick={() => setLoginWay(2)}>
              forgot your password
            </p>
          </form>
        )}
        {loginWay === 2 && (
          <form className="other-login-ways">
            <label className="login-label">Enter email ID</label>
            <input 
             type="text" 
             autoComplete="off"
             onChange={(e)=> setEmail(e.target.value)}
            />

            {timer === 0 ? (
              <button
                className="login-btn-primary"
                onClick={ (e) => { 
                  e.preventDefault()
                  sendOtp({ email, step: 2}, setLoginWay, startTimer, "loginData");
                }}
              >
                Send OTP
              </button>
            ) : (
              <>
                <div className="register-otp-timer">
                  {timer > 0 ? (
                    <p>OTP expires in: {timer}s</p>
                  ) : (
                    <button
                      className="resend-otp-btn"
                      // onClick={() =>
                      //   // sendOtp({ email, college, step: 2 }, setStep, startTimer)
                      // }
                    >
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
                      autoComplete="off"
                      maxLength={1}
                      value={otp[i]}
                      onChange={(e) => {
                        const val = e.target.value
                          .replace(/[^0-9a-z]/g, "")
                          .toLowerCase();
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
                    onClick={() => 
                      verifyOtp({ email, otp: otp.join("") }, setLoginWay, "loginData")
                     }
                  >
                    {loading ? (
                      <Loader
                        className="animate-spin"
                        style={{ height: "18px" }}
                      />
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        <div className="login-box-container">
          <div className="login-small-box"></div>
          <div className="login-small-box"></div>
          <div className="login-small-box"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
