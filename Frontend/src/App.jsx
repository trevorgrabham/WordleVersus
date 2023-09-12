import React, { useState, useEffect } from 'react';
import GamePage from './Pages/GamePage';
import useGameSettingStore from './stores/gameSettingStore';

function App() {
  const { wordleLength, setGameType, setWordleLength } = useGameSettingStore();

  useEffect(() => {
    setGameType('normal');
    setWordleLength(5);
  }, []);

  return <div>{wordleLength && <GamePage />}</div>;
}

export default App;
