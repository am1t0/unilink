import React, { useState } from 'react'
import './profilesSearch.css'
import DefaultAvatar from '../../assets/images/avatar.png'

export default function ProfilesSearch() {
    
    const [users, setUsers] = useState([
        { avatar: DefaultAvatar,name : 'Amit Pandey', email : 'amitpandey@gmail.com'},
        { avatar: DefaultAvatar,name: 'Amey Lokhande', email: 'amey@gmail.com'}
    ]);

  return (
    <div className='user-search'>
    <div className="search-input">
      <input type="text" placeholder='new conversation'/>
    </div>

    <ul className="search-results">
       {
         users.map((u)=>(
           <div className="user-searched">
            <img src={u.avatar} alt="avatar" />
            <div className="users-info">
             <h3>{u.name}</h3>
              <p>{u.email}</p>
            </div>
           </div>
         ))
       }
    </ul>
 </div>
  )
}
// #e8e8e8