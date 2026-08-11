import React, {useContext} from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import {userDataContext} from './context/UserContext.jsx'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {

  let {userData} = useContext(userDataContext);

  return (
    <Routes>
      <Route path="/" element={userData? <Home/> : <Navigate to="/login"/>}/>
      <Route path="/signup" element={userData? <Navigate to="/"/> : <Signup/>}/>
      <Route path="/login" element={userData? <Navigate to="/"/> : <Login/>}/>
    </Routes>
  )
}

export default App