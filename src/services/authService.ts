import axios from 'axios';
import { apiConfig } from '../apiConfig';

const AUTH_API_URL = `${apiConfig.agriBlockchain}/auth`;

/**
 * Logs in a user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {string} role - The user's role (e.g., 'farmer', 'consumer', 'admin').
 * @returns {Promise<any>} The response from the API.
 */
export const login = async (email: string, password: string, role: 'farmer' | 'consumer' | 'admin') => {
  const response = await axios.post(`${AUTH_API_URL}/login`, {
    email,
    password,
    role,
  });
  return response.data;
};

/**
 * Registers a new user.
 * @param {string} name - The user's full name.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {string} role - The user's role (e.g., 'farmer', 'consumer', 'admin').
 * @returns {Promise<any>} The response from the API.
 */
export const signup = async (name: string, email: string, password: string, role: 'farmer' | 'consumer' | 'admin') => {
  const response = await axios.post(`${AUTH_API_URL}/register`, {
    name,
    email,
    password,
    role,
  });
  return response.data;
};

/**
 * Verifies a user's token.
 * @returns {Promise<any>} The response from the API.
 */
export const verifyToken = async (): Promise<any> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await axios.get(`${AUTH_API_URL}/verify`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return response.data;
};

/**
 * Sets up axios interceptors for authentication
 */
export const setupAuthInterceptors = () => {
  // Request interceptor to add token to all requests
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Response interceptor to handle auth errors
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Clear local storage on auth error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login page if needed
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );
};
