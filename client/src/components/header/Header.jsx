import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faEnvelope, faHome, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import "./header.css";

const Header = () => {
  return (
    <header className="header">
      {/* Left Side (Logo + Icons) */}
      <div className="header-left">
        <div className="logo">UNILINK</div>
        <div className="header-icons">

          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faHome} className="icon" />
            <span className="icon-text">Home</span>
          </div>

          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faEnvelope} className="icon" />
            <span className="icon-text">Messages</span>
          </div>

          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faBell} className="icon" />
            <span className="icon-text">Notifications</span>
          </div>
         
        </div>
      </div>

      {/* Right Side (Search Bar + User) */}
      <div className="header-right">
        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
        <div className="user-icon">
          <FontAwesomeIcon icon={faUser} className="icon" />
        </div>
      </div>
    </header>
  );
};

export default Header;
