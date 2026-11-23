import { createContext, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { processQueue } from '../services/offlineQueue';

// Tracks online/offline status and gives screens a "refreshKey" to refetch on.
const NetworkContext = createContext({ online: true, refreshKey: 0 });
export const useNetwork = () => useContext(NetworkContext);

export function NetworkProvider({ children }) {
  const [online, setOnline] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const bump = () => setRefreshKey((k) => k + 1); // tells screens to refetch

  // Watch the connection. When it comes back, send queued actions, then refresh.
  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      setOnline((prev) => {
        const nowOnline = !!state.isConnected;
        if (!prev && nowOnline) processQueue().then(bump);
        return nowOnline;
      });
    });
    return () => unsub();
  }, []);

  // When the app returns to the foreground, refresh the current screen.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') bump();
    });
    return () => sub.remove();
  }, []);

  return <NetworkContext.Provider value={{ online, refreshKey }}>{children}</NetworkContext.Provider>;
}
