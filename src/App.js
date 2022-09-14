import './App.css';
import Landing from './components/Landing';
import React from "react";
import Lobby from './components/Lobby';
import Room from './components/Room';

import LobbyHost from './components/LobbyHost';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from "react-redux"

import { useEffect } from 'react';
function App() {

  useEffect(()=>{
    try{
   
    }
    catch(error)
    {
      console.log('loggedOut');
    }
  })
  return (
    <>
      <Router>
        {/* Route helps us to navigate between pages */}
        <Routes>
        <Route exact path="/" element={<Landing/>}> </Route>
        <Route exact path="/Lobby" element={<Lobby/>}></Route>
        <Route exact path="/Host/Lobby" element={<LobbyHost/>}></Route>
        <Route  path="/Room/:room" element={<Room/>}></Route>
         </Routes>
      </Router>
    </>
  );
}

export default App;
