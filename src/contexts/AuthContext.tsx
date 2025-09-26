import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { User, AuthState, LoginCredentials, WalletConnection } from '../types/auth';
import * as authService from '../services/authService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  connectWallet: () => Promise<WalletConnection>;
  disconnectWallet: () => void;
  walletConnection: WalletConnection | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'WALLET_CONNECTED'; payload: WalletConnection }
  | { type: 'WALLET_DISCONNECTED' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        isLoading: false, 
        isAuthenticated: true, 
        user: action.payload,
        error: null 
      };
    case 'LOGIN_ERROR':
      return { 
        ...state, 
        isLoading: false, 
        error: action.payload 
      };
    case 'LOGOUT':
      return { 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: null 
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  };
  
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [walletConnection, setWalletConnection] = useState<WalletConnection | null>(null);

  // Real login function
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const data = await authService.login(credentials.email, credentials.password, credentials.role);
      
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        name: data.user.name,
        isVerified: data.user.isVerified,
        createdAt: data.user.createdAt
      };

      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', data.token);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
      dispatch({ type: 'LOGIN_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    setWalletConnection(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('walletConnection');
  };

  const connectWallet = async (): Promise<WalletConnection> => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest']
        });

        const connection: WalletConnection = {
          address: accounts[0],
          balance: (parseInt(balance, 16) / 1e18).toFixed(4),
          network: 'ethereum',
          provider: 'metamask'
        };

        setWalletConnection(connection);
        localStorage.setItem('walletConnection', JSON.stringify(connection));
        return connection;
      } else {
        throw new Error('MetaMask not installed');
      }
    } catch (error) {
      throw new Error('Failed to connect wallet');
    }
  };

  const disconnectWallet = () => {
    setWalletConnection(null);
    localStorage.removeItem('walletConnection');
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedWallet = localStorage.getItem('walletConnection');
    
    if (savedUser) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: JSON.parse(savedUser) });
    }
    
    if (savedWallet) {
      setWalletConnection(JSON.parse(savedWallet));
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      connectWallet,
      disconnectWallet,
      walletConnection
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};