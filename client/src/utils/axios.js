import axios from 'axios';
import { authStorage } from './storage';

const api = axios.create({
  baseURL: 'https://eventrix-ohj5.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = authStorage.getToken(); // in-memory cache — no storage read per request
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default api;
