import React, { useState } from "react";
import {
  Home,
  MessageCircle,
  Bell,
  Search,
  Filter,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import "./header.css";
import { useAuthStore } from "../../store/useAuthStore";
import { Link } from "react-router-dom";
import { useNotificationsStore } from "../../store/useNotifications";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authUser, logout } = useAuthStore();

  const { notifications } = useNotificationsStore();

  const unreadNotifications = notifications?.filter(
    (notification) => notification?.status !== "read"
  );

  return (
    <header className="headder">
      <div className="headder-left">
        <div className="headder-logo">Uni Link</div>

        <nav className="headder-nav-links">
          <Link to="/" className="headder-nav-item">
            <Home size={20} className="headder-icon" />
            <span className="headder-nav-text">Home</span>
          </Link>
          <Link to="/chats" className="headder-nav-item">
            <MessageCircle size={20} className="headder-icon" />
            <p className="headder-nav-text">Message</p>
          </Link>
          <Link
            to="/notifications"
            className="headder-nav-item notification-icon-wrapper"
          >
            <Bell size={20} className="headder-icon" />
            {unreadNotifications?.length > 0 && (
              <span className="notification-badge">{unreadNotifications?.length}</span>
            )}
            <span className="headder-nav-text">Notification</span>
          </Link>
        </nav>
      </div>

      <div className="headder-search-container">
        <input
          type="text"
          placeholder="Search Links"
          className="headder-search-input"
        />
        <Search size={18} className="headder-search-icon" />
        <Filter size={18} className="headder-filter-icon" />
      </div>

      <div className="headder-auth-buttons">
        {!authUser ? (
          <>
            {" "}
            <Link to={"/login"}>
              <button className="headder-login-btn">
                <LogIn size={16} /> Login
              </button>
            </Link>
            <Link to={"/register"}>
              <button className="headder-signup-btn">
                <UserPlus size={16} /> Signup
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link to={`/profilepage/${authUser?._id}`}>
              <button className="headder-menu-item">
                <UserRound size={20} />
              </button>
            </Link>
            <button className="headder-menu-item" onClick={logout}>
              <LogOut size={16} />
            </button>
          </>
        )}
      </div>
      <button
        className="headder-hamburger"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMenuOpen && (
        <div className="headder-mobile-menu">
          {!authUser ? (
            <>
              {" "}
              <Link to={"/login"}>
                <button className="headder-login-btn">
                  <LogIn size={16} /> Login
                </button>
              </Link>
              <Link to={"/register"}>
                <button className="headder-signup-btn">
                  <UserPlus size={16} /> Signup
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to={`/profilepage/${authUser?._id}`}>
                <button
                  className="headder-menu-item"
                  style={{ border: "none" }}
                >
                  <UserRound size={20} />
                </button>
              </Link>
              <button className="headder-menu-item" onClick={logout}>
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
