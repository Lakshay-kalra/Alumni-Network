const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const eventRoutes = require('./routes/eventRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust in production
    methods: ['GET', 'POST']
  }
});

mongoose.set('bufferCommands', false);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/users', userRoutes);

// Socket.io for Real-time chat & notifications
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a personal room for private messages
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('sendMessage', (data) => {
    // data should have { sender, receiver, text }
    io.to(data.receiver).emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendDistPath = path.join(__dirname, '../frontend/dist');
  const frontendIndexPath = path.join(frontendDistPath, 'index.html');

  if (fs.existsSync(frontendIndexPath)) {
    app.use(express.static(frontendDistPath));

    app.get(/.*/, (req, res) => {
      res.sendFile(frontendIndexPath);
    });
  } else {
    console.warn(`Frontend build not found at ${frontendIndexPath}. Skipping static file serving.`);
  }
}

const startServer = async () => {
  if (!process.env.MONGO_URI) {
    console.error('Missing required environment variable: MONGO_URI');
    process.exit(1);
  }

  if (!process.env.JWT_SECRET) {
    console.error('Missing required environment variable: JWT_SECRET');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('Connected to MongoDB');

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

startServer();
