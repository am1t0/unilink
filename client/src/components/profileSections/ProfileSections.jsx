import React from 'react'
import './profileSections.css'
import { BsGrid, BsFilePost, BsBriefcase } from 'react-icons/bs'

export default function ProfileSections() {
  return (
    <ul className="profile-sections-sidebar">
      <li>
        <BsGrid className="icon" />
        <h3>Overview</h3>
      </li>
      <li>
        <BsFilePost className="icon" />
        <h3>Posts</h3>
      </li>
      <li>
        <BsBriefcase className="icon" />
        <h3>Career</h3>
      </li>
    </ul>
  )
}
