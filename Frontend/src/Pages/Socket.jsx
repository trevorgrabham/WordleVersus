import React, { useRef, useState, useEffect } from 'react';
import socket from '../socket';

function Socket() {
  const [receivedMessages, setReceivedMessages] = useState([]);
  const inputRef = useRef('');

  useEffect(() => {
    socket.on('connection', () => {
      console.log('Connected to the server');
    });

    socket.on('receivedMessage', (data) => {
      console.log('Received a message from the server');
      console.log(data);
      setReceivedMessages((prev) => [...prev, data.message]);
    });

    return () => {
      socket.off('receivedMessage');
    };
  }, []);

  const sendMessage = () => {
    socket.emit('sendMessage', { message: inputRef.current.value });
    inputRef.current.value = '';
  };

  return (
    <div>
      <input ref={inputRef} placeholder="Message" type="text" />
      <button onClick={sendMessage}>Send Message</button>
      <ul>
        {receivedMessages.length !== 0 &&
          receivedMessages.map((message, index) => {
            return <li key={index}>{message}</li>;
          })}
      </ul>
    </div>
  );
}

export default Socket;
