// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface WalletNonceResponse {
  nonce: string;
  message: string;
}

export interface WalletVerifyRequest {
  walletAddress: string;
  signature: string;
  message: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    walletAddress?: string;
    role: string;
  };
}

// Blockchain Types
export interface BalanceResponse {
  address: string;
  balance: string;
  balanceWei: string;
}

export interface SendTransactionRequest {
  to: string;
  amount: string;
}

export interface TransactionResponse {
  transactionHash: string;
  from: string;
  to: string;
  amount: string;
  gasUsed: string;
  blockNumber: number;
  status: 'success' | 'failed';
}

export interface TransactionDetails {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  value: string;
  valueWei: string;
  gasPrice: string;
  gasLimit: string;
  nonce: number;
  data: string;
  chainId: number;
  receipt?: {
    status: 'success' | 'failed';
    gasUsed: string;
    effectiveGasPrice: string;
    logs: unknown[];
  };
}

export interface GasEstimateRequest {
  to: string;
  amount: string;
}

export interface GasEstimateResponse {
  gasEstimate: string;
  gasPrice: {
    wei: string;
    gwei: string;
  };
  estimatedCost: {
    wei: string;
    eth: string;
  };
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
}

// Payment Types
export interface CreatePaymentRequest {
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP';
  orderId: string;
  description: string;
}

export interface PaymentResponse {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  cryptoAmount: string;
  exchangeRate: number;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
}

export interface PaymentDetails {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  cryptoAmount: string;
  exchangeRate: number;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  blockchainTxHash?: string;
  recipientAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentListResponse {
  payments: PaymentDetails[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  errors?: unknown[];
}

export interface ApiError {
  message: string;
  status: number;
  data?: unknown;
}

// HTTP Client Types
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  timeout?: number;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';