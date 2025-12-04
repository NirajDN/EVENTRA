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
    origin: [
      'http://localhost:3000',
      'https://eventra-rosy.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean),
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
// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/eventra';
    console.log(`Attempting to connect to MongoDB at: ${mongoURI.includes('@') ? mongoURI.split('@')[1] : mongoURI}`); // Log URI without credentials

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log('Connected to MongoDB successfully');

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('Full error details:', err);
    // Do not exit process in dev, but might want to in prod if DB is critical
    if (process.env.NODE_ENV === 'production') {
      console.error('Critical: Database connection failed in production. Exiting.');
      process.exit(1);
    }
  }
};

connectDB();
