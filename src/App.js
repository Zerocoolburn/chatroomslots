import React, { useState } from 'react';
import Chatroom from './Chatroom';

function App() {
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name) {
      setJoined(true);
    }
  };

  return (
    <div>
      {!joined ? (
        <form onSubmit={handleSubmit}>
          <label>Enter your name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <button type="submit">Join Chatroom</button>
        </form>
      ) : (
        <Chatroom name={name} />
      )}
    </div>
  );
}

export default App;
