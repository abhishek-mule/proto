const agriBlockchainApiUrl = import.meta.env.VITE_AGRI_BLOCKCHAIN_API_URL || 'https://agri-backend-ecci.onrender.com/api';
const paymentApiUrl = import.meta.env.VITE_PAYMENT_API_URL || 'https://agri-payments-backend-aivg.onrender.com/api';

export const apiConfig = {
  agriBlockchain: agriBlockchainApiUrl,
  payment: paymentApiUrl,
};

// Backward-compat shim for older services
export const API_BASE_URL = paymentApiUrl;
