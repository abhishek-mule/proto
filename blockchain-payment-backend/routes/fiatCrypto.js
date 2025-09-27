const express = require('express');
const router = express.Router();
const FiatCryptoService = require('../services/fiatCryptoService');
const { authenticateToken } = require('../middleware/auth');
const fiatCryptoService = new FiatCryptoService();

/**
 * @route   POST /api/fiat-crypto/upi-payment
 * @desc    Process a UPI payment and convert to crypto
 * @access  Private
 */
router.post('/upi-payment', authenticateToken, async (req, res) => {
  try {
    const paymentData = req.body;
    
    if (!paymentData.amount || !paymentData.upiId || !paymentData.recipientAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required payment data' 
      });
    }
    
    // Add user ID from authenticated request
    paymentData.userId = req.user.id;
    
    const result = await fiatCryptoService.processUpiToCrypto(paymentData);
    
    res.status(200).json({
      success: true,
      payment: result.payment,
      transaction: result.transaction
    });
  } catch (error) {
    console.error('Error processing UPI payment:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * @route   GET /api/fiat-crypto/transactions
 * @desc    Get user's transaction history
 * @access  Private
 */
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const transactions = await fiatCryptoService.getTransactionHistory(req.user.id);
    
    res.status(200).json({
      success: true,
      transactions
    });
  } catch (error) {
    console.error('Error getting transaction history:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;