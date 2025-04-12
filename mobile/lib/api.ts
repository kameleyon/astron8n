import axios from 'axios';

// Use process.env.EXPO_PUBLIC_API_URL for Expo public env variable
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;