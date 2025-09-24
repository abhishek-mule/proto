const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { ethers } = require('ethers');
const { authenticateToken } = require('../middleware/auth');
const Payment = require('../models/Payment');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Initialize provider (using Polygon Amoy testnet)
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'https://rpc-amoy.polygon.technology');

// Mock exchange rate service (in production, use real API)
const getExchangeRate = async (currency = 'USD') => {
  // Mock rates - in production, integrate with CoinGecko, CoinMarketCap, etc.
  const rates = {
    USD: 2000, // 1 ETH = 2000 USD
    EUR: 1800,
    GBP: 1500,
  };
  return rates[currency] || rates.USD;
};

// Create crypto payment
router.post('/crypto', [
  body('amount').isFloat({ min: 0.01 }),
  body('currency').isIn(['USD', 'EUR', 'GBP']),
  body('orderId').isString().isLength({ min: 1, max: 100 }),
  body('description').isString().isLength({ min: 1, max: 500 }),
], handleValidationErrors, authenticateToken, async (req, res) => {
  try {
    const { amount, currency, orderId, description } = req.body;

    // Check if orderId already exists
    const existingPayment = await Payment.findOne({ orderId });
    if (existingPayment) {
      return res.status(400).json({ message: 'Order ID already exists' });
    }

    // Get exchange rate
    const exchangeRate = await getExchangeRate(currency);

    // Calculate crypto amount (assuming ETH/MATIC)
    const cryptoAmount = (amount / exchangeRate).toFixed(18);
    const cryptoAmountWei = ethers.parseEther(cryptoAmount);

    // Create payment record
    const payment = new Payment({
      userId: req.user._id,
      orderId,
      amount,
      currency,
      description,
      status: 'pending',
      paymentMethod: 'crypto',
      exchangeRate,
      cryptoAmount: cryptoAmountWei.toString(),
    });

    await payment.save();

    res.status(201).json({
      paymentId: payment._id,
      orderId: payment.orderId,
      amount: payment.amount,
      currency: payment.currency,
      cryptoAmount,
      exchangeRate,
      description: payment.description,
      status: payment.status,
      createdAt: payment.createdAt,
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Failed to create payment' });
  }
});

// Get payment status
router.get('/:paymentId', [
  param('paymentId').isMongoId(),
], handleValidationErrors, authenticateToken, async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findOne({
      _id: paymentId,
      userId: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // If payment has a blockchain transaction, check its status
    if (payment.blockchainTxHash) {
      try {
        const receipt = await provider.getTransactionReceipt(payment.blockchainTxHash);
        if (receipt) {
          if (receipt.status === 1 && payment.status === 'processing') {
            payment.status = 'completed';
            await payment.save();
          } else if (receipt.status === 0 && payment.status === 'processing') {
            payment.status = 'failed';
            await payment.save();
          }
        }
      } catch (error) {
        console.error('Transaction check error:', error);
        // Continue with current status if transaction check fails
      }
    }

    res.json({
      paymentId: payment._id,
      orderId: payment.orderId,
      amount: payment.amount,
      currency: payment.currency,
      cryptoAmount: payment.cryptoAmount ? ethers.formatEther(payment.cryptoAmount) : null,
      exchangeRate: payment.exchangeRate,
      description: payment.description,
      status: payment.status,
      blockchainTxHash: payment.blockchainTxHash,
      recipientAddress: payment.recipientAddress,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ message: 'Failed to get payment' });
  }
});

// List user payments
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
], handleValidationErrors, authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const payments = await Payment.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Payment.countDocuments({ userId: req.user._id });

    const formattedPayments = payments.map(payment => ({
      paymentId: payment._id,
      orderId: payment.orderId,
      amount: payment.amount,
      currency: payment.currency,
      cryptoAmount: payment.cryptoAmount ? ethers.formatEther(payment.cryptoAmount) : null,
      exchangeRate: payment.exchangeRate,
      description: payment.description,
      status: payment.status,
      blockchainTxHash: payment.blockchainTxHash,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    }));

    res.json({
      payments: formattedPayments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('List payments error:', error);
    res.status(500).json({ message: 'Failed to list payments' });
  }
});

module.exports = router;