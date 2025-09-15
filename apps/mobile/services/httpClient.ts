import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '../config/api';

// Create axios instance
const httpClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
httpClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid - only remove token if we have a response
      try {
        await AsyncStorage.removeItem('authToken');
        console.log('Auth token removed due to 401 error');
      } catch (storageError) {
        console.error('Error removing auth token:', storageError);
      }
    } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      // Network error - don't remove token, just log the error
      console.error('Network Error:', error.message);
    } else {
      // Other errors
      console.error('HTTP Error:', error.response?.data || error.message);
    }
    
    return Promise.reject(error);
  }
);

export default httpClient;