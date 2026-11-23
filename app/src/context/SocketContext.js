import { createContext, useContext, useEffect, useState } from 'react';
import { createSocket } from '../services/socket';
import { getToken } from '../services/storage';
import { useAuth } from './AuthContext';

// Provides one shared Socket.io connection for the whole app while logged in.
const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Only connect when logged in; disconnect on logout.
    if (!user) {
      setSocket(null);
      return;
    }
    let s;
    (async () => {
      const token = await getToken();
      s = createSocket(token);
      setSocket(s);
    })();
    return () => {
      if (s) s.disconnect();
    };
  }, [user]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}
