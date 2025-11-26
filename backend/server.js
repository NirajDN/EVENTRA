require('dotenv').config();
const app = require('./src/app');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const Message = require('./src/models/Message');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.io logic
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('sendMessage', async (data) => {
    const { sender, receiver, content } = data;

    try {
      // Save message to database
      const message = new Message({ sender, receiver, content });
      await message.save();

      // Emit to receiver
      io.to(receiver).emit('receiveMessage', message);
      // Emit back to sender (for confirmation/UI update if needed)
      io.to(sender).emit('receiveMessage', message);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('profileUpdate', (data) => {
    // Broadcast to all connected clients
    io.emit('profileUpdated', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Connect to MongoDB
if (!process.env.MONGO_URI) {
  console.warn('Warning: MONGO_URI is not defined in .env');
}

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eventra')
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
