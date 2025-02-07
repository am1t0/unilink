import { useEffect } from "react";
import {Toaster} from "react-hot-toast"
import "./App.css";
import Login from "./pages/login/Login";
import { useAuthStore } from "./store/useAuthStore.";
import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";

function App() {
  const { authUser, checkAuth, checkingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(checkingAuth) return null

  return (
    <>
    <Routes>
      <Route path="/" element={authUser? <Home /> : <Navigate to={"/login"}/> }/>
      <Route path="/login" element={!authUser? <Login /> : <Navigate to={"/"}/> }/>
      <Route path="/register" element={!authUser? <Register /> : <Navigate to={"/"}/> }/>
    </Routes>
      <Toaster/>
    </>
  );
}

export default App;
