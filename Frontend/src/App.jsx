import React, { useState, useEffect } from 'react';
import GamePage from './Pages/GamePage';
import useGameSettingStore from './stores/gameSettingStore';
import usePlayerStore from './stores/playerStore';
import SignUpPage from './Pages/SignUpPage';
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';

function App() {
  const { wordleLength, setGameType, setWordleLength } = useGameSettingStore();
  const { playerId } = usePlayerStore();

  useEffect(() => {
    setGameType('normal');
    setWordleLength(5);
  }, []);

  return (
    <div>
      <GamePage />
      {/* {!playerId && <LoginPage />} */}
      {/* {playerId && <GamePage />} */}
    </div>
  );
}

export default App;
