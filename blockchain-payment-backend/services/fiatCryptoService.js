class FiatCryptoService {
  async processUpiToCrypto(paymentData) {
    // Minimal stub to keep API operational in environments without gateway keys
    const { amount, upiId, recipientAddress, userId } = paymentData || {};
    if (!amount || !upiId || !recipientAddress) {
      throw new Error('Missing required payment data');
    }

    const fakePayment = {
      gateway: 'mock-upi',
      status: 'processing',
      amount,
      currency: 'INR',
      upiId,
      userId: userId || null,
      createdAt: new Date().toISOString()
    };

    const fakeTx = {
      network: process.env.BLOCKCHAIN_NETWORK || 'polygon-amoy',
      to: recipientAddress,
      valueWei: '0',
      hash: null,
      note: 'Mock conversion only (no on-chain tx executed)'
    };

    return { payment: fakePayment, transaction: fakeTx };
  }

  async getTransactionHistory(userId) {
    // Return empty history in the stub
    return [];
  }
}

module.exports = FiatCryptoService;