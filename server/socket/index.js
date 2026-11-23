const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Sets up Socket.io: verify the token on connect, join the user's rooms,
// and let clients join/leave a specific request's chat room.
module.exports = function initSocket(io) {
  // Check the JWT sent by the client as auth.token before allowing the connection.
  io.use((socket, next) => {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (!token) return next(new Error('No token'));
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload.id;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    // Register these synchronously FIRST, so a client that joins a request room
    // right after connecting isn't missed while we look up the facility below.
    socket.join('user:' + socket.userId); // personal room for status updates
    socket.on('join_request', ({ requestId }) => socket.join('request:' + requestId));
    socket.on('leave_request', ({ requestId }) => socket.leave('request:' + requestId));
    socket.on('disconnect', () => console.log('🔌 Socket disconnected:', socket.userId));

    // Staff also join their facility room — for new requests + inventory updates.
    User.findById(socket.userId)
      .select('facilityId')
      .then((user) => {
        if (user && user.facilityId) socket.join('facility:' + user.facilityId);
      });

    console.log('🔌 Socket connected:', socket.userId);
  });
};
