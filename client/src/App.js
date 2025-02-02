import { useEffect } from "react";
import "./App.css";
import Login from "./pages/login/Login";
import { useAuthStore } from "./store/useAuthStore.";
import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";

function App() {
  const { authUser, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth, authUser]);

  
  return (
    <Routes>
      <Route path="/" element={authUser? <Home /> : <Navigate to={"/login"}/> }/>
      <Route path="/login" element={!authUser? <Login /> : <Navigate to={"/"}/> }/>
      <Route path="/register" element={!authUser? <Register /> : <Navigate to={"/"}/> }/>
    </Routes>
  );
}

export default App;
