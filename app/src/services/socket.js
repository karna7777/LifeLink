import { io } from 'socket.io-client';
import { API_URL } from '../config';

// Create a Socket.io connection authenticated with the user's token.
// Socket.io auto-reconnects by default, which Phase 9 relies on.
export function createSocket(token) {
  return io(API_URL, { auth: { token }, transports: ['websocket'] });
}
