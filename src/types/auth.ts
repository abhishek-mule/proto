export interface User {
  id: string;
  email: string;
  role: 'consumer' | 'farmer' | 'admin';
  name: string;
  avatar?: string;
  walletAddress?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: 'consumer' | 'farmer' | 'admin';
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  role: 'consumer' | 'farmer' | 'admin';
}

export interface WalletConnection {
  address: string;
  balance: string;
  network: string;
  provider: 'metamask' | 'walletconnect' | 'coinbase';
}