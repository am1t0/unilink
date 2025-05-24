import React, { useState, useEffect, useRef } from "react";
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
import { useMessageStore } from "../../store/useMessageStore";
import { useNotificationsStore } from "../../store/useNotifications";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { resolveAvatar } from "../../utilities/defaultImages";

const Header = () => {
  // Stores
  const { authUser, logout, searchUsers } = useAuthStore();
  const { createConversation } = useMessageStore();
  const { notifications } = useNotificationsStore();

  // UI State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Search state
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  console.log("searchResults", searchResults);

  const [searchDropdownVisible, setSearchDropdownVisible] = useState(false);
  const searchBoxRef = useRef();

  //navigate
  const navigate = useNavigate();

  // Handle scroll to hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setSearchDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const fetch = async () => {
        if (!searchText.trim()) {
          setSearchResults([]);
          return;
        }
        const users = await searchUsers(searchText);
        setSearchResults(users);
      };

      fetch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  const unreadNotifications = notifications?.filter(
    (notification) => notification?.status !== "read"
  );

  return (
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
              <span className="headder-nav-text">Message</span>
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

        {/* Search box */}
        <div className="headder-search-container" ref={searchBoxRef}>
          <input
            type="text"
            placeholder="Search users"
            className="headder-search-input"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setSearchDropdownVisible(true);
            }}
          />
          <Search size={18} className="headder-search-icon" />
          <Filter size={18} className="headder-filter-icon" />

          {searchDropdownVisible && searchText && (
            <div className="search-dropdown">
              {searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <div
                    className="search-result"
                    key={user._id}
                    onClick={() => {
                      navigate(`/profilepage/${user._id}`);
                      setSearchText("");
                      setSearchResults([]);
                      setSearchDropdownVisible(false);
                    }}
                  >
                    <img src={resolveAvatar(user)} alt="avatar" />
                    <div>
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="search-result no-user">No users found</div>
              )}
            </div>
          )}
        </div>

        {/* Auth buttons */}
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

        {/* Mobile menu */}
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
