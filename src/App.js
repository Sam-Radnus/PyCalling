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

   useEffect(() => {
    // Define the API URL and request body
    const apiUrl = 'https://log-project.onrender.com/create';
    const requestBody = {
      name: 'PyCalling',
    };

    // Make the API call
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response) {
          return response.json();
        } else {
          throw new Error('API request failed');
        }
      })
      .then((data) => {
        // Handle the API response data here
        console.log('API response:', data);
      })
      .catch((error) => {
        // Handle any errors that occurred during the API call
        console.error('API error:', error);
      });
  }, []);
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
