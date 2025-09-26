import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const FIAT_CRYPTO_API = `${API_BASE_URL}/api/fiat-crypto`;

export interface UPIPaymentRequest {
  amount: number;
  currency: string;
  upiId: string;
  description: string;
  userId: string;
  tokenId?: string;
}

export interface PaymentTransaction {
  _id: string;
  userId: string;
  amount: number;
  fiatCurrency: string;
  cryptoAmount: number;
  cryptoCurrency: string;
  status: 'pending' | 'completed' | 'failed';
  transactionHash?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Service for interacting with the fiat-to-crypto payment bridge API
 */
const fiatCryptoService = {
  /**
   * Process a UPI payment and convert to crypto
   * @param paymentData - UPI payment data
   * @returns Promise with transaction details
   */
  async processUPIPayment(paymentData: UPIPaymentRequest): Promise<PaymentTransaction> {
    const response = await axios.post(`${FIAT_CRYPTO_API}/process-payment`, paymentData);
    return response.data.transaction;
  },

  /**
   * Get transaction history for a user
   * @param userId - User ID
   * @returns Promise with transaction history
   */
  async getTransactionHistory(userId: string): Promise<PaymentTransaction[]> {
    const response = await axios.get(`${FIAT_CRYPTO_API}/transactions/${userId}`);
    return response.data.transactions;
  },

  /**
   * Get current exchange rates
   * @param fiatCurrency - Fiat currency code (e.g., 'INR')
   * @param cryptoCurrency - Crypto currency code (e.g., 'ETH')
   * @returns Promise with exchange rate
   */
  async getExchangeRate(fiatCurrency: string, cryptoCurrency: string): Promise<number> {
    const response = await axios.get(`${API_BASE_URL}/api/price-oracle/convert`, {
      params: {
        from: fiatCurrency,
        to: cryptoCurrency,
        amount: 1
      }
    });
    return response.data.convertedAmount;
  }
};

export default fiatCryptoService;