import React, { useState, useEffect } from 'react';
import GamePage from './Pages/GamePage';
import useGameSettingsStore from './stores/gameSettingsStore';
import useGameDataStore from './stores/gameDataStore';
import usePlayerStore from './stores/playerStore';
import SignUpPage from './Pages/SignUpPage';
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';
import GuessInput from './Components/GuessInput';
import { fetchWordle, getWordList } from './gameLogic';

function App() {
  console.log(`Rendering the App component`);
  const setWordleLength = useGameSettingsStore(
    (state) => state.setWordleLength,
  );

  useEffect(async () => {
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
