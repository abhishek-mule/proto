import apiService from '../services/apiService';
import web3Service from '../services/web3Service';

// Authenticate with wallet
const authenticateWallet = async (walletAddress: string) => {
  try {
    // Get nonce
    const nonceResponse = await apiService.getWalletNonce(walletAddress);
    const { nonce } = nonceResponse;

    // Sign message
    const message = `Sign this message to authenticate: ${nonce}`;
    const signature = await web3Service.signMessage(message);

    // Verify signature
    const authResponse = await apiService.verifyWalletSignature({
      walletAddress,
      signature,
      message
    });

    // Store token
    localStorage.setItem('token', authResponse.token);
    return authResponse;
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
};

// Traditional email/password authentication
const authenticateEmail = async (email: string, password: string) => {
  try {
    const authResponse = await apiService.login({ email, password });
    localStorage.setItem('token', authResponse.token);
    return authResponse;
  } catch (error) {
    console.error('Email authentication failed:', error);
    throw error;
  }
};

// Register new user
const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  try {
    const authResponse = await apiService.register({
      email,
      password,
      firstName,
      lastName
    });
    localStorage.setItem('token', authResponse.token);
    return authResponse;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

// Check if user is authenticated
const isAuthenticated = (): boolean => {
  return apiService.isAuthenticated();
};

// Logout user
const logout = (): void => {
  apiService.logout();
  // Optionally disconnect wallet
  if (web3Service.isConnected()) {
    web3Service.disconnectWallet();
  }
};

// Example usage combining wallet and API
export const exampleAuthFlow = async () => {
  try {
    // First connect wallet
    const account = await web3Service.connectWallet();
    console.log('Wallet connected:', account.address);

    // Then authenticate with backend
    const authResult = await authenticateWallet(account.address);
    console.log('Authentication successful:', authResult.user);

    return authResult;
  } catch (error) {
    console.error('Auth flow failed:', error);
    throw error;
  }
};

// Combined wallet connection and authentication
export const connectAndAuthenticate = async () => {
  try {
    // Connect wallet
    const account = await web3Service.connectWallet();

    // Authenticate with backend
    const authResult = await authenticateWallet(account.address);

    return {
      wallet: account,
      auth: authResult
    };
  } catch (error) {
    console.error('Connect and authenticate failed:', error);
    throw error;
  }
};

export {
  authenticateWallet,
  authenticateEmail,
  registerUser,
  isAuthenticated,
  logout
};