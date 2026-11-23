// Base URL of the LifeLink server.
// Use your computer's LAN IP (NOT localhost) so a phone running Expo Go can reach it.
// Find it with:  Mac -> ipconfig getifaddr en0   |   Windows -> ipconfig
// If your IP changes (new network), update the line below.
export const API_URL = 'http://10.7.12.181:5000';

// All REST routes live under /api.
export const API_BASE = `${API_URL}/api`;
