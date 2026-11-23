// Connects to MongoDB Atlas using the MONGO_URI from server/.env.
// Kept in its own file so index.js stays easy to read.
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  // Fail loudly with a clear message if the student forgot to set the URI.
  if (!uri) {
    throw new Error('MONGO_URI is missing — copy .env.example to .env and paste your Atlas connection string.');
  }
  await mongoose.connect(uri);
  console.log('✅ MongoDB connected');
}

module.exports = connectDB;
