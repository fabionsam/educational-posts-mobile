import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default URLs based on platform: Android emulator uses 10.0.2.2, iOS / Web uses localhost
export const DEFAULT_API_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

const api = axios.create({
  baseURL: DEFAULT_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Initialize custom API URL if stored
AsyncStorage.getItem('@EduBlog:apiUrl').then((storedUrl) => {
  if (storedUrl) {
    api.defaults.baseURL = storedUrl;
  }
});

export const updateBaseUrl = async (newUrl) => {
  if (!newUrl) return;
  const formatted = newUrl.trim().replace(/\/$/, '');
  api.defaults.baseURL = formatted;
  await AsyncStorage.setItem('@EduBlog:apiUrl', formatted);
};

// Request interceptor to attach JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@EduBlog:token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Failed to retrieve auth token:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
