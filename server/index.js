// LifeLink server entry point.
// Phase 0: Express app + MongoDB connection + Socket.io skeleton + health route.
// Routes, socket handlers, and the cron job are added in later phases.

require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

const app = express();

// --- Middleware ---
app.use(cors()); // allow the Expo app (different origin) to call this API
app.use(express.json()); // parse JSON request bodies
// Serve uploaded images (prescription + chat photos) as static files.
app.use('/uploads', express.static('uploads'));

// --- Health check: confirms the server is up without needing the database ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'LifeLink API' });
});

// Express and Socket.io must share one HTTP server so they run on the same port.
const server = http.createServer(app);

// Socket.io skeleton. Rooms and events (request:new, message:new, ...) come later.
const io = new Server(server, { cors: { origin: '*' } });
io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);
  socket.on('disconnect', () => console.log('🔌 Socket disconnected:', socket.id));
});
// Store io on the app so route handlers can emit events in later phases.
app.set('io', io);

const PORT = process.env.PORT || 5000;

// Start the HTTP server first so the health route works even before Atlas is set up,
// then try to connect to MongoDB and report the result.
server.listen(PORT, () => {
  console.log(`🚀 LifeLink server running on port ${PORT}`);
  connectDB().catch((err) => {
    console.warn('⚠️  MongoDB not connected:', err.message);
    console.warn('   The server is still running, but database routes will fail until this is fixed.');
  });
});
