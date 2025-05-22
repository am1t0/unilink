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
  Bookmark,
} from "lucide-react";
import "./header.css";
import { useAuthStore } from "../../store/useAuthStore";
import { Link, NavLink } from "react-router-dom";
import { useNotificationsStore } from "../../store/useNotifications";
import { useEffect } from "react";
import { resolveAvatar } from '../../utilities/defaultImages'
import ProfilesSearch from "../profilesSearch/ProfilesSearch";

const Header = () => {
  //user and notification store states
  const { authUser, logout } = useAuthStore();
  const { notifications } = useNotificationsStore();

  //component states
  const [isMenuOpen, setIsMenuOpen] = useState(false); //mobile menu
  const [showNavbar, setShowNavbar] = useState(true); //navbar visibility on scroll
  const [lastScrollY, setLastScrollY] = useState(0); //last scroll position

  //profile search 
  const [ show, setShow]  = useState();

  //listen to scroll event to show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setShowNavbar(false);
      } else {
        // Scrolling up
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const unreadNotifications = notifications?.filter(
    (notification) => notification?.status !== "read"
  );

  return (
    // wrap for occupying space so main content does't hide below it
    <div className="wrap">
      <header
        className={`headder ${!showNavbar ? "hidden-navbar" : "show-navbar"}`}
      >
        <div className="headder-left">
          <div className="headder-logo">Uni Link</div>

          <nav className="headder-nav-links">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `headder-nav-item ${isActive ? "active-link" : ""}`
              }
            >
              <Home size={20} className="headder-icon" />
              <span className="headder-nav-text">Home</span>
            </NavLink>

            <NavLink
              to="/chats"
              className={({ isActive }) =>
                `headder-nav-item ${isActive ? "active-link" : ""}`
              }
            >
              <MessageCircle size={20} className="headder-icon" />
              <p className="headder-nav-text">Message</p>
            </NavLink>

            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `headder-nav-item notification-icon-wrapper ${
                  isActive ? "active-link" : ""
                }`
              }
            >
              <Bell size={20} className="headder-icon" />
              {unreadNotifications?.length > 0 && (
                <span className="notification-badge">
                  {unreadNotifications?.length}
                </span>
              )}
              <span className="headder-nav-text">Notification</span>
            </NavLink>

            <NavLink
              to="/savedPosts"
              className={({ isActive }) =>
                `headder-nav-item ${isActive ? "active-link" : ""}`
              }
            >
              <Bookmark size={20} className="headder-icon" />
              <span className="headder-nav-text">Saved</span>
            </NavLink>
          </nav>
        </div>

        {
          show ?   <ProfilesSearch show = {show} setShow={setShow} purpose={"Search users"} />
               :    <div className="headder-search-container">
          <input
            type="text"
            placeholder="Search Links"
            className="headder-search-input"
            onClick={()=> setShow(!show)}
          />
          <Search size={18} className="headder-search-icon" />
          <Filter size={18} className="headder-filter-icon" />
        </div>
        }

        <div className="headder-auth-buttons">
          {!authUser ? (
            <>
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
                <div className="header-user-profile">
                  <img src={resolveAvatar(authUser)} alt="" />
                </div>
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
    </div>
  );
};

export default Header;
