import logo from './logo.svg';
import './App.css';
import Landing from './components/Landing';
import React from "react";
import Lobby from './components/Lobby';
import Room from './components/Room';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
function App() {
  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
        <Route exact path="/" element={<Landing/>}> </Route>
        <Route exact path="/Lobby" element={<Lobby/>}></Route>
        <Route  path="/Room/:room" element={<Room ></Room>}></Route>
         </Routes>
      </Router>
    </>
  );
}

export default App;
