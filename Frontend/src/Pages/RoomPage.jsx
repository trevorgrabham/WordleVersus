import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useErrorStore from '../stores/errorStore';
import useGameSettingsStore from '../stores/gameSettingsStore';
import Header from '../Components/Header';
import Error from '../Components/Error';
import socket from '../socket';

function RoomPage() {
  console.log(`Rendering the RoomPage component`);
  const navigate = useNavigate();
  const roomCodeInputRef = useRef('');
  const newRoomCodeInputRef = useRef('');
  const setRoomCode = useGameSettingsStore((state) => state.setRoomCode);
  const [addError, clearErrors, getErrorMessage] = useErrorStore((state) => [
    state.addError,
    state.clearErrors,
    state.getErrorMessage,
  ]);

  // TODO: use the cleanup function to clean up any socket.on connections we need
  useEffect(() => {
    socket.on('connection', () => {
      console.log('Connected to the server');
    });

    return () => {};
  }, []);

  const joinRoom = () => {
    if (!roomCodeInputRef.current.value) {
      addError({
        target: 'roomTarget',
        message: 'Room code is a required field',
        component: 'joinRoom',
      });
      return;
    }
    let roomCode = roomCodeInputRef.current.value;
    socket.emit('joinRoom', { roomCode: roomCode }, (response) => {
      if (response.error) {
        addError({
          target: 'roomTarget',
          message: response.message,
          component: 'joinRoom',
        });
        return;
      }
      console.log(`Successfully connected to room ${roomCode}`);
      clearErrors({ target: 'roomTarget', component: 'joinRoom' });
      clearErrors({ target: 'roomTarget', component: 'createRoom' });
      roomCodeInputRef.current.value = '';
      setRoomCode(roomCode);
      navigate(`/game/${roomCode}`);
      return;
    });
  };

  const createRoom = () => {
    if (!newRoomCodeInputRef.current.value) {
      addError({
        target: 'roomTarget',
        message: 'Room code is a required field',
        component: 'createRoom',
      });
      return;
    }
    let roomCode = newRoomCodeInputRef.current.value;
    socket.emit('createRoom', { roomCode: roomCode }, (response) => {
      if (response.error) {
        addError({
          target: 'roomTarget',
          message: response.message,
          component: 'createRoom',
        });
        return;
      }
      console.log(`Successfully connected to room ${roomCode}`);
      clearErrors({ target: 'roomTarget', component: 'createRoom' });
      clearErrors({ target: 'roomTarget', component: 'joinRoom' });
      newRoomCodeInputRef.current.value = '';
      setRoomCode(roomCode);
      navigate(`/game/${roomCode}`);
      return;
    });
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
          {getErrorMessage({ target: 'roomTarget', component: 'joinRoom' }) && (
            <Error fontSize="12">
              {getErrorMessage({ target: 'roomTarget', component: 'joinRoom' })}
            </Error>
          )}
        </div>
        <div>
          <input
            type="text"
            ref={newRoomCodeInputRef}
            placeholder="Room Code..."
          />
          <button onClick={createRoom}>Create Room</button>
          {getErrorMessage({
            target: 'roomTarget',
            component: 'createRoom',
          }) && (
            <Error fontSize="12">
              {getErrorMessage({
                target: 'roomTarget',
                component: 'createRoom',
              })}
            </Error>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomPage;
