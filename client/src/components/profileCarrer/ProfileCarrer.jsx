import React from 'react';
import { BsBriefcase, BsBook, BsPlusLg, BsPencil, BsPen, BsPlus } from 'react-icons/bs';
import './profileCarrer.css';

export default function ProfileCarrer() {
  const education = [
    {
      id: 1,
      img: "https://upload.wikimedia.org/wikipedia/en/b/b5/DTU%2C_Delhi_official_logo.png",
      school: "Delhi Technological University",
      degree: "Bachelor of Technology",
      field: "Computer Science",
      startYear: "2021",
      endYear: "2025",
      grade: "8.9 CGPA",
      activities: "Technical Club Lead, Coding Club Member"
    },
    {
      id: 2,
      img: "https://seeklogo.com/images/D/dps-delhi-public-school-logo-B4D0B0977A-seeklogo.com.png",
      school: "Delhi Public School",
      degree: "Higher Secondary",
      field: "Science with Computer",
      startYear: "2019",
      endYear: "2021",
      grade: "95%",
      activities: "School Captain, Science Club President"
    }
  ];

  const experience = [
    {
      id: 1,
      img: "https://yt3.googleusercontent.com/K8WVrQAQHTTwsHEtisMYcNai7p7XIlyEAdZg86qYw78ye57r5DRemHQ9Te4PcD_v98HB-ZvQjQ=s900-c-k-c0x00ffffff-no-rj",
      role: "Software Development Intern",
      company: "Google",
      location: "Delhi, India",
      duration: "May 2023 - July 2023",
      description: "Led development of internal tools using React and Node.js. Implemented real-time analytics dashboard reducing reporting time by 40%.",
      skills: ["React", "Node.js", "MongoDB", "AWS"]
    },
    {
      id: 2,
      img: 'https://yt3.googleusercontent.com/qgSeLfJk2OKnQicVDvc_VSlSISmAmWVHYtmSTckcC_iUn7hVfpURctMAqoSz0u4xfER6rlKDBA=s900-c-k-c0x00ffffff-no-rj',
      role: "Data Analytics Intern",
      company: "Mircrosoft",
      location: "Indore, India",
      duration: "May 2024 - July 2024",
      description: "Worked on developing full-stack web applications using MERN stack."
    }
  ];

  return (
    <div className="profile-carrer">
      <section className='experience-container section-container'>
        <div className="section-header">
          <h2>Experience</h2>
          <BsPlus className="add-icon"/>
        </div>

        <ul className="items-list">
          {experience.map((exp) => (
            <li key={exp.id}>
              <div className="item-data">
                <img src={exp.img} alt={exp.company} />
                <div className="item-details">
                  <h3>{exp.role}</h3>
                  <h4>{exp.company}</h4>
                  <p className="location">{exp.location}</p>
                  <p className="duration">{exp.duration}</p>
                  <p className="description">{exp.description}</p>
                </div>
              </div>
              <BsPencil className='edit-icon' />
            </li>
          ))}
        </ul>
      </section>

      <section className='education-container section-container'>
        <div className="section-header">
          <h2>Education</h2>
          <BsPlus className="add-icon"/>
        </div>

        <ul className="items-list">
          {education.map((edu) => (
            <li key={edu.id}>
              <div className="item-data">
                <img src={edu.img} alt={edu.school} />
                <div className="item-details">
                  <h3>{edu.school}</h3>
                  <h4>{edu.degree} • {edu.field}</h4>
                  <p className="duration">{edu.startYear} - {edu.endYear}</p>
                  <p className="grade">Grade: {edu.grade}</p>
                  <p className="activities">{edu.activities}</p>
                </div>
              </div>
              <BsPencil className='edit-icon' />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
