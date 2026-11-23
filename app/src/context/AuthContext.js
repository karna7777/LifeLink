import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { saveAuth, saveUser, getToken, getUser, clearAuth } from '../services/storage';
import { registerForPush } from '../services/notifications';

// Holds the logged-in user and the auth actions, shared across the whole app.
// Replaces the Phase 1 dev role switcher.
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check stored login on startup

  // On app start, restore any saved session so the user stays logged in.
  useEffect(() => {
    (async () => {
      const token = await getToken();
      const savedUser = await getUser();
      if (token && savedUser) setUser(savedUser);
      setLoading(false);
    })();
  }, []);

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    await saveAuth(data.token, data.user);
    setUser(data.user);
    registerForPush(); // save this device's push token (best-effort)
  }

  async function register(payload) {
    const { data } = await api.post('/auth/register', payload);
    await saveAuth(data.token, data.user);
    setUser(data.user);
    registerForPush();
  }

  async function logout() {
    await clearAuth();
    setUser(null);
  }

  // Update the user locally + in storage after a profile edit.
  async function updateUser(updated) {
    setUser(updated);
    await saveUser(updated);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
