import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useErrorStore from '../stores/errorStore';
import useGameSettingsStore from '../stores/gameSettingsStore';
import Error from '../Components/Error';

/*
  Responsibilities - Gather all of the information needed to set up a Game. (wordleLength, public/private, gameType, roomCode [if creating])

  External data needed - socket: a prop passed down from the main App component. Needed to join/create a room.
                         gameSettingsStore: set all of the game settings info. 
                         errorStore: set and display any errors that may come up from user input or the socket server.

  Data set - gameSettingsStore: need to update all of the game settings data gathered from the player. 

  Goes to - DEVELOPMENT: goes straight to the GamePage. 
            PRODUCTION: should go to a LobbyPage where there is a chat for all of the people in the room, and a ready button that when pressed on both ends should then move the players to the GamePage.
*/
function RoomPage({ socket }) {
  console.log(`Rendering the RoomPage component`);
  const [setRoomCode, setWordleLength] = useGameSettingsStore((state) => [
    state.setRoomCode,
    state.setWordleLength,
  ]);
  const [addError, clearErrors, getErrorMessage] = useErrorStore((state) => [
    state.addError,
    state.clearErrors,
    state.getErrorMessage,
  ]);
  const navigate = useNavigate();
  const roomCodeInputRef = useRef('');
  const newRoomCodeInputRef = useRef('');

  // TODO: use the cleanup function to clean up any socket.on connections we need
  useEffect(() => {
    socket.on('connection', () => {
      console.log('Connected to the server');
    });

    // ONLY FOR DEVELOPMENT PRUPOSES
    setWordleLength(5);

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
      navigate(`/lobby/${roomCode}`);
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
      navigate(`/lobby/${roomCode}`);
      return;
    });
  };
  return (
    <div>
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
