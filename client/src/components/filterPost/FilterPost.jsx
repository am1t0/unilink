import React from "react";
import "./filterpost.css";
import { Filter, User, Check, Calendar, Briefcase, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const FilterPost = () => {
  return (
    <div className="filter-post-container">
      <div className="filter-left">
        <div className="filter-group">
          <Filter className="filter-icon" />
          <span>Filter Your Posts:</span>
        </div>

        <div className="filter-group">
          <div className="filter-user">
            <User className="filter-icon" />
            <div className="verified-icon">
              <Check className="verified-check" />
            </div>
          </div>
          <span>All</span>
        </div>

        <div className="filter-group">
          <Calendar className="filter-icon" />
          <span>Event</span>
        </div>

        <div className="filter-group">
          <Briefcase className="filter-icon" />
          <span>Job & Internship</span>
        </div>
      </div>

      <Link to={"/post-create"} style={{textDecoration: "none", color:"white"}}><div className="filter-right">
        <div className="add-post">
          <Plus className="filter-icon" />
          <span>Add Your New Post</span>
        </div>
      </div></Link>
    </div>
  );
};

export default FilterPost;
