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
export const login = async (email, password, role) => {
  const response = await axios.post(`${AUTH_API_URL}/login`, {
    email,
    password,
    role,
  });
  return response.data;
};
