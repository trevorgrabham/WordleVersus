import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import GamePage from './Pages/GamePage';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import RoomPage from './Pages/RoomPage';

function App() {
  console.log(`Rendering the App component`);
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/room" element={<RoomPage />} />
        // TODO: protect the game route and add a parameter to the route to get
        the roomCode
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
