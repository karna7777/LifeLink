import AsyncStorage from '@react-native-async-storage/async-storage';

// Single place for all local storage access (per project rules).
// Phase 2 uses it for the login token + user; later phases add cache + queue keys.
const KEYS = { TOKEN: 'token', USER: 'user' };

// Save token + user together after login/register.
export async function saveAuth(token, user) {
  await AsyncStorage.multiSet([
    [KEYS.TOKEN, token],
    [KEYS.USER, JSON.stringify(user)],
  ]);
}

export async function getToken() {
  return AsyncStorage.getItem(KEYS.TOKEN);
}

export async function getUser() {
  const raw = await AsyncStorage.getItem(KEYS.USER);
  return raw ? JSON.parse(raw) : null;
}

// Update just the stored user (e.g. after editing the profile).
export async function saveUser(user) {
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
}

// Clear everything on logout.
export async function clearAuth() {
  await AsyncStorage.multiRemove([KEYS.TOKEN, KEYS.USER]);
}

// --- Cache for list screens (so they show instantly + work offline) ---
export async function setCache(key, value) {
  try {
    await AsyncStorage.setItem('cache:' + key, JSON.stringify(value));
  } catch (e) {
    // storage full / unavailable — ignore, it's only a cache
  }
}

export async function getCache(key) {
  try {
    const raw = await AsyncStorage.getItem('cache:' + key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// --- Offline queue (actions created while offline, sent later) ---
export async function getQueue() {
  try {
    const raw = await AsyncStorage.getItem('offlineQueue');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export async function setQueue(items) {
  try {
    await AsyncStorage.setItem('offlineQueue', JSON.stringify(items));
  } catch (e) {
    // ignore
  }
}
