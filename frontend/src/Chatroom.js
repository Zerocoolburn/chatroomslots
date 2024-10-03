import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Make sure this is your backend URL

function Chatroom({ name }) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [balance, setBalance] = useState(1000);

  useEffect(() => {
    socket.emit('join', name);

    socket.on('message', (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('message');
    };
  }, [name]);

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit('chatMessage', message);
    setMessage('');
  };

  const playSlots = (amount) => {
    socket.emit('slots', amount);
  };

  return (
    <div>
      <div>
        <h3>Chat</h3>
        <div>
          {chat.map((msg, idx) => (
            <p key={idx}>{msg}</p>
          ))}
        </div>
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
      <div>
        <h3>Your Balance: {balance}</h3>
        <button onClick={() => playSlots(100)}>Play Slots with 100</button>
      </div>
    </div>
  );
}

export default Chatroom;
