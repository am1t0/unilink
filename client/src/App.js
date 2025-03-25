import { useEffect } from "react";
import {Toaster} from "react-hot-toast"
import "./App.css";
import Login from "./pages/login/Login";
import { useAuthStore } from "./store/useAuthStore";
import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import ProfilePage from "./pages/profilePage/ProfilePage";
import ProfileEdit from "./pages/profileEdit/ProfileEdit";
import PostCreate from "./pages/postCreate/PostCreate";
import FilterPost from "./components/filterPost/FilterPost";
import Chats from "./pages/chats/Chats";
import { SocketProvider } from "./providers/Socket";


function App() {
  const { authUser, checkAuth, checkingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(checkingAuth) return null

  return (
    <>
   <SocketProvider>
    <Routes>
      < Route path="/" element={authUser? <Home /> : <Navigate to={"/login"}/> }> 
        <Route path="/" element={<FilterPost />} />
        <Route path="/chats" element= { <Chats/> }/>
        <Route path="/profilePage" element={<ProfilePage /> }/>
      </Route>
      <Route path="/login" element={!authUser? <Login /> : <Navigate to={"/"}/> }/>
      <Route path="/register" element={!authUser? <Register /> : <Navigate to={"/"}/> }/>
      <Route path="/profileedit" element={authUser? <ProfileEdit /> : <Navigate to={"/login"}/> }/>
      <Route path="/post-create" element={authUser? <PostCreate /> : <Navigate to={"/login"}/> }/>
    </Routes>
    </SocketProvider>
    <Toaster/>
    </>
  );
}

export default App;
