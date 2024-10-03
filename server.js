const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(cors());
app.use(express.json());

let users = {};

io.on('connection', (socket) => {
  console.log('a user connected: ' + socket.id);

  socket.on('join', async (name) => {
    users[socket.id] = { name, balance: 1000 };
    socket.emit('message', `Welcome ${name}!`);
    socket.broadcast.emit('message', `${name} has joined the chat.`);
  });

  socket.on('chatMessage', (msg) => {
    io.emit('message', `${users[socket.id].name}: ${msg}`);
  });

  socket.on('slots', (amount) => {
    const user = users[socket.id];
    if (user.balance >= amount) {
      const result = Math.random() > 0.5 ? 'win' : 'lose';
      user.balance += result === 'win' ? amount : -amount;
      io.emit('message', `${user.name} played slots and ${result} ${amount}. Balance: ${user.balance}`);
    } else {
      socket.emit('message', 'Not enough balance to play!');
    }
  });

  socket.on('disconnect', () => {
    const name = users[socket.id].name;
    io.emit('message', `${name} has left the chat.`);
    delete users[socket.id];
  });
});

app.get('/', (req, res) => {
  res.send('Chatroom Slots is running.');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
