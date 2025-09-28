import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import {
  ApiResponse,
  ApiError,
  RequestConfig,
  HttpMethod,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  WalletNonceResponse,
  WalletVerifyRequest,
  BalanceResponse,
  SendTransactionRequest,
  TransactionResponse,
  TransactionDetails,
  GasEstimateRequest,
  GasEstimateResponse,
  CreatePaymentRequest,
  PaymentResponse,
  PaymentDetails,
  PaymentListResponse,
} from '../types/api';

class ApiService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = import.meta.env.VITE_API_URL || 'https://agri-payments-backend-aivg.onrender.com') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: error.message || 'An error occurred',
          status: error.response?.status || 500,
          data: error.response?.data,
        };

        // Handle token expiration
        if (error.response?.status === 401) {
          this.clearToken();
        }

        return Promise.reject(apiError);
      }
    );
  }

  // Token management
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private clearToken(): void {
    localStorage.removeItem('token');
  }

  // Generic HTTP methods
  private async request<T>(
    method: HttpMethod,
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.request({
      method,
      url,
      data,
      ...config,
    });

    return response.data.data as T;
  }

  // Authentication methods
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('POST', '/api/auth/register', data);
    this.setToken(response.token);
    return response;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('POST', '/api/auth/login', data);
    this.setToken(response.token);
    return response;
  }

  async getWalletNonce(walletAddress: string): Promise<WalletNonceResponse> {
    return this.request<WalletNonceResponse>('GET', `/api/auth/wallet/nonce/${walletAddress}`);
  }

  async verifyWalletSignature(data: WalletVerifyRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('POST', '/api/auth/wallet/verify', data);
    this.setToken(response.token);
    return response;
  }

  // Blockchain methods
  async getBalance(address: string): Promise<BalanceResponse> {
    return this.request<BalanceResponse>('GET', `/api/blockchain/balance/${address}`);
  }

  async sendTransaction(data: SendTransactionRequest): Promise<TransactionResponse> {
    return this.request<TransactionResponse>('POST', '/api/blockchain/send', data);
  }

  async getTransaction(txHash: string): Promise<TransactionDetails> {
    return this.request<TransactionDetails>('GET', `/api/blockchain/transaction/${txHash}`);
  }

  async estimateGas(data: GasEstimateRequest): Promise<GasEstimateResponse> {
    return this.request<GasEstimateResponse>('POST', '/api/blockchain/estimate-gas', data);
  }

  // Payment methods
  async createPayment(data: CreatePaymentRequest): Promise<PaymentResponse> {
    return this.request<PaymentResponse>('POST', '/api/payment/crypto', data);
  }

  async getPayment(paymentId: string): Promise<PaymentDetails> {
    return this.request<PaymentDetails>('GET', `/api/payment/${paymentId}`);
  }

  async getPayments(page: number = 1, limit: number = 10): Promise<PaymentListResponse> {
    return this.request<PaymentListResponse>('GET', '/api/payment', {
      params: { page, limit },
    });
  }

  // Utility methods
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Basic JWT validation (you might want to decode and check expiry)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  logout(): void {
    this.clearToken();
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('GET', '/health');
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;