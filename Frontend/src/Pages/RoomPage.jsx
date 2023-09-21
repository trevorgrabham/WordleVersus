import React, { useEffect, useRef, useState } from 'react';
import useErrorStore from '../stores/errorStore';
import Header from '../Components/Header';
import Error from '../Components/Error';
import socket from '../socket';

function RoomPage() {
  console.log(`Rendering the RoomPage component`);
  const roomCodeInputRef = useRef('');
  const newRoomCodeInputRef = useRef('');
  const [roomTarget, addError, clearErrors, getErrorMessage] = useErrorStore(
    (state) => [
      state.roomTarget,
      state.addError,
      state.clearErrors,
      state.getErrorMessage,
    ],
  );

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
    socket.emit(
      'joinRoom',
      { roomCode: roomCodeInputRef.current.value },
      (response) => {
        if (response.error) {
          addError({
            target: 'roomTarget',
            message: response.message,
            component: 'joinRoom',
          });
          return;
        }
        console.log(
          `Successfully connected to room ${roomCodeInputRef.current.value}`,
        );
        clearErrors({ target: 'roomTarget', component: 'joinRoom' });
        roomCodeInputRef.current.value = '';
        // set the roomCode in gameSettingStore
        // navigate to /game/roomCode
        return;
      },
    );
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
    socket.emit(
      'createRoom',
      { roomCode: newRoomCodeInputRef.current.value },
      (response) => {
        if (response.error) {
          addError({
            target: 'roomTarget',
            message: response.message,
            component: 'createRoom',
          });
          return;
        }
        console.log(
          `Successfully connected to room ${newRoomCodeInputRef.current.value}`,
        );
        clearErrors({ target: 'roomTarget', component: 'createRoom' });
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
