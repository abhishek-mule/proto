const agriBlockchainApiUrl = import.meta.env.VITE_AGRI_BLOCKCHAIN_API_URL || 'http://localhost:5000/api';
const paymentApiUrl = import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:5001/api';

export const apiConfig = {
  agriBlockchain: agriBlockchainApiUrl,
  payment: paymentApiUrl,
};
