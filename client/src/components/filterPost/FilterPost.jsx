import React, { useState } from "react";
import "./filterpost.css";
import { Filter, User, Calendar, Briefcase } from "lucide-react";

const FilterPost = () => {
  const [currentOption, setCurrentOption] = useState();

  return (
    <aside className="post-filter">
      <div className="filter-header">
        <Filter />
        <p>Filter Posts</p>
      </div>

      {/* <hr/> */}

      <ul className="post-filter-options">
        <li
          className={`filter-option ${currentOption === "General" ? "selected" : ""}`}
          id="general"
          onClick={() => setCurrentOption("General")}
        >
          <User size={22} />
          <p>General</p>
        </li>
        <li
          className={`filter-option ${currentOption === "Event" ? "selected" : ""}`}
          id="event"
          onClick={() => setCurrentOption("Event")}
        >
          <Calendar size={22} />
          <p>Event</p>
        </li>
        <li
          className={`filter-option ${currentOption === "Opportunity" ? "selected" : ""}`}
          id="opportunity"
          onClick={() => setCurrentOption("Opportunity")}
        >
          <Briefcase size={22} />
          <p>Opportunity</p>
        </li>
      </ul>
    </aside>
  );
};

export default FilterPost;
