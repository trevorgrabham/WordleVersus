import React, { useEffect, useRef, useState } from 'react';
import Header from '../Components/Header';
import socket from '../socket';

function RoomPage() {
  console.log(`Rendering the RoomPage component`);
  const roomCodeInputRef = useRef('');
  const newRoomCodeInputRef = useRef('');

  useEffect(() => {
    socket.on('connection', () => {
      console.log('Connected to the server');
    });

    return () => {};
  }, []);

  const joinRoom = () => {
    if (!roomCodeInputRef.current.value) {
      // setError
      console.log('Room code is a required field');
      return;
    }
    socket.emit(
      'joinRoom',
      { roomCode: roomCodeInputRef.current.value },
      (response) => {
        if (response.error) {
          // set error
          console.log(response.message);
          return;
        }
        console.log(
          `Successfully connected to room ${roomCodeInputRef.current.value}`,
        );
        roomCodeInputRef.current.value = '';
        // set the roomCode in gameSettingStore
        // navigate to /game/roomCode
        return;
      },
    );
  };

  const createRoom = () => {
    if (!newRoomCodeInputRef.current.value) {
      // set error
      console.log('Room code is a required field');
      return;
    }
    socket.emit(
      'createRoom',
      { roomCode: newRoomCodeInputRef.current.value },
      (response) => {
        if (response.error) {
          //set error
          console.log(response.message);
          return;
        }
        console.log(
          `Successfully connected to room ${newRoomCodeInputRef.current.value}`,
        );
        newRoomCodeInputRef.current.value = '';
        // set the roomCode in gameSettingStore
        // navigate to /game/roomCode
        return;
      },
    );
  };
  return (
    <div>
      <Header />
      <div>
        <div>
          <input
            type="text"
            ref={roomCodeInputRef}
            placeholder="Room Code..."
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
        <div>
          <input
            type="text"
            ref={newRoomCodeInputRef}
            placeholder="Room Code..."
          />
          <button onClick={createRoom}>Create Room</button>
        </div>
      </div>
    </div>
  );
}

export default RoomPage;
