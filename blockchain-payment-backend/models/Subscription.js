const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscription: {
    endpoint: {
      type: String,
      required: true
    },
    keys: {
      p256dh: {
        type: String,
        required: true
      },
      auth: {
        type: String,
        required: true
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '365d' // Automatically remove subscriptions after 1 year of inactivity
  }
}, {
  timestamps: true
});

// Compound index for faster lookups
subscriptionSchema.index({ 'subscription.endpoint': 1, user: 1 }, { unique: true });

// Add a method to get the public VAPID key
subscriptionSchema.statics.getVapidPublicKey = function() {
  return process.env.VAPID_PUBLIC_KEY;
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
