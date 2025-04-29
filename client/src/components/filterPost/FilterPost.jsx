import React from "react";
import "./filterpost.css";
import { Filter, User, Calendar, Briefcase, Check } from "lucide-react";
import { usePostStore } from "../../store/usePostStore";


const FilterPost = () => {
  const { currentFilter, toggleFilter } = usePostStore();

  return (
    <aside className="post-filter">
      <div className="filter-header">
        <Filter />
        <p>Filter Posts</p>
      </div>

      <ul className="post-filter-options">
        <li
          className={`filter-option ${currentFilter === "Personal" ? "selected" : ""}`}
          id="personal"
          onClick={() => toggleFilter("Personal")}
        >
          {currentFilter === "Personal" && <Check size={18} className="tick-icon" />}
          <User size={22} />
          <p>Personal</p>
        </li>
        <li
          className={`filter-option ${currentFilter === "Event" ? "selected" : ""}`}
          id="event"
          onClick={() => toggleFilter("Event")}
        >
          {currentFilter === "Event" && <Check size={18} className="tick-icon" />}
          <Calendar size={22} />
          <p>Event</p>
        </li>
        <li
          className={`filter-option ${currentFilter === "Job & Internship" ? "selected" : ""}`}
          id="opportunity"
          onClick={() => toggleFilter("Job & Internship")}
        >
          {currentFilter === "Job & Internship" && <Check size={18} className="tick-icon" />}
          <Briefcase size={22} />
          <p>Job & Internship</p>
        </li>
      </ul>
    </aside>
  );
};

export default FilterPost;