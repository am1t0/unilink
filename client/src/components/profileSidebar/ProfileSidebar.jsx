import React, { useState } from 'react'
import './profileSidebar.css'

export default function ProfileSidebar() {
  const [active, setActive] = useState('overview')

  const handleSelection = (section) => {
    setActive(section)
  }

  return (
    <aside className="profile-sidebar">
      <h3 className="sidebar-title">Quick Navigation</h3>

      <ul className="profile-contents">
        {['Overview', 'My Posts', 'Career Journey'].map((item, index) => (
          <li
            key={index}
            className={`content-item ${active === item.toLowerCase().replace(' ', '-') ? 'active' : ''}`}
            onClick={() => handleSelection(item.toLowerCase().replace(' ', '-'))}
          >
            {item}
          </li>
        ))}
      </ul>
    </aside>
  )
}
