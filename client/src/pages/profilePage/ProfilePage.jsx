import React, { useEffect } from "react";
import { UserPlus, Send, Pencil, GraduationCap, BookOpen, Phone, Share2 } from "lucide-react";
import "./profilepage.css";
import { useAuthStore } from "../../store/useAuthStore";
import ProfileSidebar from "../../components/profileSidebar/ProfileSidebar";
import ProfileCard from "../../components/profileCard/ProfileCard";

const ProfilePage = () => {
  const { authUser, checkingAuth } = useAuthStore();

  if(checkingAuth) return null

  return (
    <div className="profile-page">
        {/* <ProfileSidebar/> */}
        <ProfileCard/>
    </div>
  );
};

export default ProfilePage;
