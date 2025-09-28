import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://agri-backend-ecci.onrender.com';
const API_TIMEOUT = 30000; // 30 seconds for cold starts
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

// Create axios instance with enhanced configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: true, // Include cookies for auth
  });

  // Request interceptor for logging and auth
  client.interceptors.request.use(
    (config) => {
      console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
      
      // Add auth token if available
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      console.error('❌ Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor with retry logic
  client.interceptors.response.use(
    (response) => {
      console.log('✅ API Response:', response.status, response.config.url);
      return response;
    },
    async (error: AxiosError) => {
      console.error('❌ API Error:', error.response?.status, error.config?.url, error.message);
      
      const originalRequest = error.config as any;
      
      // Don't retry if we've already tried max times
      if (originalRequest._retry >= MAX_RETRIES) {
        return Promise.reject(error);
      }

      // Initialize retry count
      originalRequest._retry = (originalRequest._retry || 0) + 1;

      // Retry on specific error conditions
      const shouldRetry = 
        error.code === 'ECONNABORTED' || // Timeout
        error.response?.status === 503 || // Service unavailable (cold start)
        error.response?.status === 502 || // Bad gateway
        error.response?.status >= 500;    // Server errors

      if (shouldRetry) {
        const delay = RETRY_DELAY * Math.pow(2, originalRequest._retry - 1); // Exponential backoff
        console.log(`🔄 Retrying request (${originalRequest._retry}/${MAX_RETRIES}) after ${delay}ms:`, originalRequest.url);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return client(originalRequest);
      }

      // Handle auth errors
      if (error.response?.status === 401) {
        console.log('🔒 Authentication required, redirecting to login');
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Create the main API client
export const apiClient = createApiClient();

// Utility function to handle API calls with loading states
export const withLoadingState = async <T>(
  apiCall: () => Promise<T>,
  onLoadingChange?: (loading: boolean) => void
): Promise<T> => {
  try {
    onLoadingChange?.(true);
    const result = await apiCall();
    return result;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  } finally {
    onLoadingChange?.(false);
  }
};

// Cold start detector - ping the server to wake it up
export const warmUpServer = async (): Promise<void> => {
  try {
    console.log('🔥 Warming up server...');
    await apiClient.get('/health', { timeout: 5000 });
    console.log('✅ Server is warm and ready');
  } catch (error) {
    console.warn('⚠️ Server warm-up failed, but continuing:', error);
  }
};

// Service status checker
export const checkServerStatus = async (): Promise<{
  status: 'online' | 'slow' | 'offline';
  responseTime: number;
}> => {
  const startTime = Date.now();
  
  try {
    await apiClient.get('/health', { timeout: 5000 });
    const responseTime = Date.now() - startTime;
    
    return {
      status: responseTime > 2000 ? 'slow' : 'online',
      responseTime
    };
  } catch (error) {
    return {
      status: 'offline',
      responseTime: Date.now() - startTime
    };
  }
};

// Enhanced error handling for user-facing messages
export const getErrorMessage = (error: any): string => {
  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. The server might be starting up, please try again.';
  }
  
  if (error.response?.status === 503) {
    return 'Service temporarily unavailable. The server is starting up, please wait a moment and try again.';
  }
  
  if (error.response?.status >= 500) {
    return 'Server error occurred. Please try again in a few moments.';
  }
  
  if (error.response?.status === 404) {
    return 'The requested resource was not found.';
  }
  
  if (error.response?.status === 401) {
    return 'Authentication required. Please log in again.';
  }
  
  if (error.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// API endpoints
export const endpoints = {
  // Authentication
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    profile: '/api/auth/profile',
    refreshToken: '/api/auth/refresh',
  },
  
  // NFT/Marketplace
  nft: {
    list: '/api/nft',
    create: '/api/nft/create',
    details: (id: string) => `/api/nft/${id}`,
    purchase: (id: string) => `/api/nft/${id}/purchase`,
  },
  
  // Farming
  farm: {
    crops: '/api/farm/crops',
    addCrop: '/api/farm/crops',
    cropDetails: (id: string) => `/api/farm/crops/${id}`,
  },
  
  // Payments
  payment: {
    initiate: '/api/payment/initiate',
    status: (id: string) => `/api/payment/${id}/status`,
    history: '/api/payment/history',
  },
  
  // System
  system: {
    health: '/health',
    contracts: '/contracts',
  }
} as const;

export default apiClient;