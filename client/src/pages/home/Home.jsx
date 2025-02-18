import React from 'react'
import "./home.css"
import Header from "../../components/header/Header"
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
   <div style={{backgroundColor: "#131C35", height: "100vh"}}>
   <Header/>
   <Outlet/>
   </div>
  )
}

export default Home