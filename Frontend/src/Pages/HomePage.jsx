import React from 'react';
import usePlayerStore from '../stores/playerStore';

function HomePage() {
  console.log(`Rendering HomePage component`);
  const { playerId, username, email } = usePlayerStore();

  return (
    <div>
      <div>
        <h1>PlayerId: {playerId || 'Empty'}</h1>
        <h1>Username: {username || 'Empty'}</h1>
        <h1>Email: {email || 'Empty'}</h1>
      </div>
    </div>
  );
}

export default HomePage;
