import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import GamePage from './Pages/GamePage';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import RoomPage from './Pages/RoomPage';
import usePlayerStore from './stores/playerStore';
import useGameSettingsStore from './stores/gameSettingsStore';

function App() {
  console.log(`Rendering the App component`);
  const roomCode = useGameSettingsStore((state) => state.roomCode);
  const playerId = usePlayerStore((state) => state.playerId);

  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<HomePage />} />
        <Route
          path="/signup"
          element={playerId ? <HomePage /> : <SignUpPage />}
        />
        <Route
          path="/login"
          element={playerId ? <HomePage /> : <LoginPage />}
        />
        <Route path="/game" element={<RoomPage />} />
        <Route path="/room" element={<RoomPage />} />
        // TODO: protect the game route and add a parameter to the route to get
        the roomCode
        <Route
          path="/game/:roomCode"
          element={roomCode ? <GamePage /> : <RoomPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
