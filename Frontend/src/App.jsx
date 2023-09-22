import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import RoomPage from './Pages/RoomPage';
import LobbyPage from './Pages/LobbyPage';
import GamePage from './Pages/GamePage';
import Header from './Components/Header';
import usePlayerStore from './stores/playerStore';
import useGameSettingsStore from './stores/gameSettingsStore';
import socket from './socket';

/*
  Responsibilities - Set up the routes for the site. Establishes and maintains a web socket connection
  External data needed - roomCode: to be able to protect the GamePage route so that nobody can start a game by themselves.
                         playerId: to be able to protect the login/signup routes so that players can't login multiple times
  Data set - N/A
  Goes to - Just a wrapper for our web pages
*/
function App() {
  console.log(`Rendering the App component`);
  const roomCode = useGameSettingsStore((state) => state.roomCode);
  const playerId = usePlayerStore((state) => state.playerId);

  useEffect(() => {
    socket.on('connection', () => {
      console.log('Successfully connected to the backend web socket');
    });

    return () => {
      if (roomCode) {
        console.log(`Leaving room ${roomCode} from the App component`);
        socket.emit('leaveRoom', { roomCode });
      }
    };
  }, []);

  return (
    <div>
      <Router>
        <Header />
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
          <Route path="/game" element={<RoomPage socket={socket} />} />
          <Route path="/room" element={<RoomPage socket={socket} />} />
          <Route
            path="/lobby/:roomCode"
            element={<LobbyPage socket={socket} />}
          />
          // TODO: add some actual functionality to the roomCode parameter. Also
          make sure that users can't enter the game page manually, only when
          redirected from the lobby
          <Route
            path="/game/:roomCode"
            element={
              roomCode ? (
                <GamePage socket={socket} />
              ) : (
                <RoomPage socket={socket} />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
