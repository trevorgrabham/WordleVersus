import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../Styles/Lobby.module.css';

function LobbyPage({ socket }) {
  console.log('Rendering LobbyPage component');
  const { roomCode } = useParams();
  const [messages, setMessages] = useState([]);
  const [opponentReady, setOpponentReady] = useState(false);
  const [imReady, setImReady] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef('');

  useEffect(() => {
    socket.on('messageReceived', (data) => {
      setMessages((state) => [
        ...state,
        { message: data.message, fromOpponent: true },
      ]);
    });

    socket.on('opponentReady', () => {
      if (imReady) return navigate(`/game/${roomCode}`);
      setOpponentReady(true);
      setMessages((state) => [
        ...state,
        { message: 'Opponent ready...', fromOpponent: true },
      ]);
    });

    socket.on('opponentUnready', () => {
      setOpponentReady(false);
      setMessages((state) => [
        ...state,
        { message: 'Opponent NOT ready...', fromOpponent: true },
      ]);
    });

    return () => {
      socket.off('messageReceived');
      socket.off('opponentReady');
      socket.off('opponentUnready');
    };
  }, [imReady]);

  const sendMessage = () => {
    const myMessage = inputRef.current.value;
    setMessages((state) => [
      ...state,
      { message: myMessage, fromOpponent: false },
    ]);
    socket.emit('messageSend', { message: myMessage, roomCode });
    inputRef.current.value = '';
  };

  const toggleReady = () => {
    if (imReady) socket.emit('unready', { roomCode });
    if (!imReady) socket.emit('ready', { roomCode });
    if (!imReady && opponentReady) return navigate(`/game/${roomCode}`);
    setImReady((state) => !state);
  };

  return (
    <div>
      <div className={styles.messageContainer}>
        {messages.map((messageObject, index) => {
          return (
            <div
              key={index}
              className={
                messageObject.fromOpponent
                  ? styles.opponentMessage
                  : styles.myMessage
              }
            >
              {messageObject.message}
            </div>
          );
        })}
      </div>
      <div className={styles.inputContainer}>
        <input
          className={styles.inputText}
          type="text"
          ref={inputRef}
          placeholder="Send a message to the lobby..."
        />
        <button onClick={sendMessage} className={styles.inputButton}>
          Send
        </button>
      </div>
      <div className={styles.readyContainer}>
        <button onClick={toggleReady}>{imReady ? 'Ready!' : 'Ready?'}</button>
      </div>
    </div>
  );
}

export default LobbyPage;
