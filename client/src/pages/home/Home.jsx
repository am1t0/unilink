import React from 'react'
import "./home.css"
import Header from "../../components/header/Header"
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
   <>
   <Header/>
   <Outlet/>
   </>
  )
}

export default Home