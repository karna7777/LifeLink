import axios from 'axios';
import { API_BASE } from '../config';
import { getToken } from './storage';

// Single axios instance for all REST calls (per project rules).
const api = axios.create({ baseURL: API_BASE, timeout: 10000 });

// Attach the saved JWT to every request automatically, so screens don't have to.
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
