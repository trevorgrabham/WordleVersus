import React from 'react';
import usePlayerStore from '../stores/playerStore';

function HomePage() {
  const { playerId, username, email } = usePlayerStore();

  return (
    <div>
      <div>
        <h1>PlayerId: {playerId}</h1>
        <h1>Username: {username}</h1>
        <h1>Email: {email}</h1>
      </div>
    </div>
  );
}

export default HomePage;
