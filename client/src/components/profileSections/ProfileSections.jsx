import React from 'react';
import { BsGrid, BsFilePost, BsBook, BsBriefcase } from 'react-icons/bs';
import './profileSections.css';

export default function ProfileSections() {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ul className="profile-sections-sidebar">
      <li onClick={() => scrollToSection('overview')}>
        <BsGrid className="icon" />
        <h3>Overview</h3>
      </li>
      <li onClick={() => scrollToSection('posts')}>
        <BsFilePost className="icon" />
        <h3>Posts</h3>
      </li>
      <li onClick={() => scrollToSection('experience')}>
        <BsBriefcase className="icon" />
        <h3>Experience</h3>
      </li>
      <li onClick={() => scrollToSection('education')}>
        <BsBook className="icon" />
        <h3>Education</h3>
      </li>
     
    </ul>
  );
}
