import { useEffect } from "react";
import {Toaster} from "react-hot-toast"
import "./App.css";
import Login from "./pages/login/Login";
import { useAuthStore } from "./store/useAuthStore.";
import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import ProfilePage from "./pages/profilePage/ProfilePage";
import ProfileEdit from "./pages/profileEdit/ProfileEdit";
import HomeScene  from "./scenes/home";
import PostCreate from "./pages/postCreate/PostCreate";

function App() {
  const { authUser, checkAuth, checkingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(checkingAuth) return null

  return (
    <>
    <Routes>
      <Route path="/" element={authUser? <Home /> : <Navigate to={"/login"}/> }
      > 
        <Route path="/" element={<HomeScene/>} />
        <Route path="/notifications" element={<><h1>Hellow notifications</h1></>} />
        <Route path="/messages" element={<><h1>Hellow message</h1></>} />
      </Route>
      <Route path="/login" element={!authUser? <Login /> : <Navigate to={"/"}/> }/>
      <Route path="/register" element={!authUser? <Register /> : <Navigate to={"/"}/> }/>
      <Route path="/profilePage" element={authUser? <ProfilePage /> : <Navigate to={"/login"}/> }/>
      <Route path="/profileedit" element={authUser? <ProfileEdit /> : <Navigate to={"/login"}/> }/>
      <Route path="/post-create" element={authUser? <PostCreate /> : <Navigate to={"/login"}/> }/>
    </Routes>
    <Toaster/>
    </>
  );
}

export default App;
