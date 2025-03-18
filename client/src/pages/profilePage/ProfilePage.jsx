import React, { useEffect } from "react";
import { UserPlus, Send, Pencil, GraduationCap, BookOpen, Phone, Share2 } from "lucide-react";
import "./profilepage.css";
import { useAuthStore } from "../../store/useAuthStore";

const ProfilePage = () => {
  const { authUser, checkingAuth } = useAuthStore();

  if(checkingAuth) return null

  return (
    <div className="profilePageContainer">
      {/* Left Section */}
      <div className="profilePageLeft">
        <div className="profilePageAvatar">
          <img src="https://static.vecteezy.com/system/resources/previews/000/439/863/non_2x/vector-users-icon.jpg" alt="Profile" />
        </div>
        <h2 className="profilePageName">{authUser.name}</h2> 
        <p className="profilePageYear">III year</p>
        <div className="profilePageDetails">
          <p><GraduationCap size={40} style = {{paddingRight : "10px"}}/> Institute of Engineering and Technology, DAVV</p>
          <p><BookOpen size={30} style = {{paddingRight : "10px"}} /> B.E , Information Technology</p>
          <p><Phone size={30} style = {{paddingRight : "10px"}} /> xxxxxxxx91</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="profilePageRight">
        <div className="profilePageActions">
          <button><UserPlus size={16} /> Follow Me</button>
          <button><Send size={16} /> Connect</button>
          <button><Pencil size={16} /> Edit Your Profile</button>
        </div>

        <div className="profilePageBio">B I O</div>

        <div className="profilePageStats">
          <p>400+ connections</p>
          <p>10+ posts</p>
        </div>

        <div className="profilePageConnections">
          <h3><Share2 size={18} /> Connections</h3>
          <div className="profilePageConnectionList">
            <div className="profilePageConnectionItem">
              <img src="https://static.vecteezy.com/system/resources/previews/000/439/863/non_2x/vector-users-icon.jpg" alt="User 1" />
            </div>
            <div className="profilePageConnectionItem">
              <img src="https://static.vecteezy.com/system/resources/previews/000/439/863/non_2x/vector-users-icon.jpg" alt="User 2" />
            </div>
            <div className="profilePageConnectionItem">
              <img src="https://static.vecteezy.com/system/resources/previews/000/439/863/non_2x/vector-users-icon.jpg" alt="User 3" />
            </div>
            <div className="profilePageConnectionItem">
              <img src="https://static.vecteezy.com/system/resources/previews/000/439/863/non_2x/vector-users-icon.jpg" alt="User 4" />
            </div>
          </div>
          <a href="#" className="profilePageSeeAll">See All</a>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
