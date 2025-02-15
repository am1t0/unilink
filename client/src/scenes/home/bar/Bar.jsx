import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import './Bar.css'
import { Link } from "react-router-dom";


const postTypes = ["All", "Event", "Job", "Internship"];

const Bar = ({ onTypeChange }) => {
  const [activeType, setActiveType] = useState("All");

  const handleTypeClick = (type) => {
    setActiveType(type);
    if (onTypeChange) onTypeChange(type);
  };

  return (
    <div className="post-type-bar">
      <div className="post-types">
        {postTypes.map((type) => (
          <button
            key={type}
            className={`post-type-btn ${activeType === type ? "active" : ""}`}
            onClick={() => handleTypeClick(type)}
          >
            {type}
          </button>
        ))}
      </div>
      
      <Link to={'/post-create'}>
      <button className="add-post-btn">
        <FontAwesomeIcon icon={faPlus} />
      </button>
      </Link>
    </div>
  );
};

export default Bar;
