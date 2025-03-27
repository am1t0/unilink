import React, { useEffect } from "react";
import {
  UserPlus,
  Send,
  Pencil,
  GraduationCap,
  BookOpen,
  Phone,
  Share2,
} from "lucide-react";
import "./profilepage.css";
import { useAuthStore } from "../../store/useAuthStore";
import ProfileCard from "../../components/profileCard/ProfileCard";
import ProfileSections from "../../components/profileSections/ProfileSections";
import ProfilePosts from "../../components/profilePosts/ProfilePosts";

const ProfilePage = () => {
  const { authUser, checkingAuth } = useAuthStore();

  if (checkingAuth) return null;

  return (
    <div className="profile-page">
       <ProfileSections/>
      <div className="profile-sections">
        <ProfileCard />
        <ProfilePosts/>
      </div>
    </div>
  );
};

export default ProfilePage;
