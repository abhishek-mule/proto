import apiService from '../services/apiService';
import web3Service from '../services/web3Service';
import { authenticateWallet } from './authIntegration';

// Complete payment flow example
export const completePaymentFlow = async (
  amount: number,
  currency: 'USD' | 'EUR' | 'GBP',
  orderId: string,
  description: string
) => {
  try {
    // Step 1: Ensure user is authenticated
    if (!apiService.isAuthenticated()) {
      throw new Error('User must be authenticated to make payments');
    }

    // Step 2: Create payment request
    console.log('Creating payment request...');
    const payment = await apiService.createPayment({
      amount,
      currency,
      orderId,
      description
    });
    console.log('Payment created:', payment);

    // Step 3: Get gas estimate for the transaction
    console.log('Estimating gas costs...');
    const gasEstimate = await apiService.estimateGas({
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', // Example recipient
      amount: payment.cryptoAmount
    });
    console.log('Gas estimate:', gasEstimate);

    // Step 4: Send the actual transaction
    console.log('Sending transaction...');
    const transaction = await apiService.sendTransaction({
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', // Example recipient
      amount: payment.cryptoAmount
    });
    console.log('Transaction sent:', transaction);

    // Step 5: Check transaction status
    console.log('Checking transaction status...');
    const txDetails = await apiService.getTransaction(transaction.transactionHash);
    console.log('Transaction details:', txDetails);

    // Step 6: Check payment status
    console.log('Checking payment status...');
    const paymentStatus = await apiService.getPayment(payment.paymentId);
    console.log('Payment status:', paymentStatus);

    return {
      payment,
      gasEstimate,
      transaction,
      txDetails,
      paymentStatus
    };

  } catch (error) {
    console.error('Payment flow failed:', error);
    throw error;
  }
};

// Wallet connection and authentication flow
export const walletAuthFlow = async () => {
  try {
    // Step 1: Connect wallet
    console.log('Connecting wallet...');
    const account = await web3Service.connectWallet();
    console.log('Wallet connected:', account);

    // Step 2: Authenticate with backend
    console.log('Authenticating with backend...');
    const authResult = await authenticateWallet(account.address);
    console.log('Authentication successful:', authResult);

    // Step 3: Get wallet balance
    console.log('Getting balance...');
    const balance = await apiService.getBalance(account.address);
    console.log('Balance:', balance);

    return {
      account,
      auth: authResult,
      balance
    };

  } catch (error) {
    console.error('Wallet auth flow failed:', error);
    throw error;
  }
};

// Payment history and management
export const getPaymentHistory = async (page: number = 1, limit: number = 10) => {
  try {
    if (!apiService.isAuthenticated()) {
      throw new Error('User must be authenticated');
    }

    const payments = await apiService.getPayments(page, limit);
    console.log('Payment history:', payments);

    return payments;
  } catch (error) {
    console.error('Failed to get payment history:', error);
    throw error;
  }
};

// Health check
export const checkApiHealth = async () => {
  try {
    const health = await apiService.healthCheck();
    console.log('API Health:', health);
    return health;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

// Example usage
export const demoFlow = async () => {
  try {
    // Check API health first
    await checkApiHealth();

    // Authenticate with wallet
    const authResult = await walletAuthFlow();

    // Create a test payment
    const paymentResult = await completePaymentFlow(
      10.00,
      'USD',
      `order_${Date.now()}`,
      'Test payment from demo'
    );

    // Get payment history
    const history = await getPaymentHistory();

    return {
      auth: authResult,
      payment: paymentResult,
      history
    };

  } catch (error) {
    console.error('Demo flow failed:', error);
    throw error;
  }
};

// Utility functions
export const formatCryptoAmount = (amount: string, decimals: number = 4): string => {
  const num = parseFloat(amount);
  return num.toFixed(decimals);
};

export const formatFiatAmount = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

export const calculateExchangeRate = (fiatAmount: number, cryptoAmount: string): number => {
  const cryptoNum = parseFloat(cryptoAmount);
  return fiatAmount / cryptoNum;
};