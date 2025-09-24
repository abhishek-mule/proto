const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'EUR', 'GBP', 'ETH', 'MATIC'],
    default: 'USD',
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['crypto', 'wallet'],
    default: 'crypto',
  },
  blockchainTxHash: {
    type: String,
    sparse: true, // Allows null values but unique if present
  },
  recipientAddress: {
    type: String,
    sparse: true,
  },
  exchangeRate: {
    type: Number, // USD to crypto conversion rate at time of payment
  },
  cryptoAmount: {
    type: String, // Amount in wei or smallest unit
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed, // Additional payment data
  },
}, {
  timestamps: true,
});

// Index for efficient queries
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);