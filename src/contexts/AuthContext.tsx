import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState, LoginCredentials, WalletConnection } from '../types/auth';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  });

  const [walletConnection, setWalletConnection] = React.useState<WalletConnection | null>(null);

  // Mock login function - replace with actual API call
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data based on role
      const mockUser: User = {
        id: `${credentials.role}-${Date.now()}`,
        email: credentials.email,
        role: credentials.role,
        name: credentials.role === 'farmer' ? 'John Smith' : 
              credentials.role === 'admin' ? 'Admin User' : 'Jane Consumer',
        isVerified: true,
        createdAt: new Date().toISOString()
      };

      dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: 'Login failed. Please try again.' });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    setWalletConnection(null);
    localStorage.removeItem('user');
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