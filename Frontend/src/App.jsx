import React, { useState, useEffect } from 'react';
import GamePage from './Pages/GamePage';
import useGameSettingsStore from './stores/gameSettingsStore';
import usePlayerStore from './stores/playerStore';
import LoginPage from './Pages/LoginPage';
import Socket from './Pages/Socket';

function App() {
  console.log(`Rendering the App component`);
  // const setWordleLength = useGameSettingsStore(
  //   (state) => state.setWordleLength,
  // );
  // const playerId = usePlayerStore((state) => state.playerId);

  // useEffect(async () => {
  //   setWordleLength(5);
  // }, []);

  // return (
  //   <div>
  //     {/* {!playerId && <SignUpPage />} */}
  //     {!playerId && <LoginPage />}
  //     {playerId && <GamePage />}
  //   </div>
  // );

  return (
    <div>
      <Socket />
    </div>
  );
}

export default App;
