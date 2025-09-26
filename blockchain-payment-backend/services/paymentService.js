const axios = require('axios');
const { Payment, Subscription, Refund } = require('../models');
const { PaymentStatus, RefundStatus } = require('../models');

class PaymentService {
  constructor() {
    this.stripeApiKey = process.env.STRIPE_API_KEY;
    this.stripe = require('stripe')(this.stripeApiKey);
  }

  /**
   * Process a payment
   * @param {Object} paymentData - Payment details
   * @returns {Promise<Object>} Payment result
   */
  async processPayment(paymentData) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: paymentData.amount,
        currency: paymentData.currency,
        payment_method: paymentData.paymentMethod,
        confirmation_method: 'automatic',
        confirm: true,
      });

      // Save payment details to the database
      const payment = new Payment({
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: PaymentStatus.COMPLETED,
        transactionId: paymentIntent.id,
        userId: paymentData.userId,
      });
      await payment.save();

      return payment;
    } catch (error) {
      throw new Error(`Payment processing failed: ${error.message}`);
    }
  }

  /**
   * Create a subscription
   * @param {Object} subscriptionData - Subscription details
   * @returns {Promise<Object>} Subscription result
   */
  async createSubscription(subscriptionData) {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: subscriptionData.customerId,
        items: [{ price: subscriptionData.priceId }],
        trial_period_days: subscriptionData.trialDays || 0,
      });

      // Save subscription details to the database
      const newSubscription = new Subscription({
        userId: subscriptionData.userId,
        stripeSubscriptionId: subscription.id,
        planId: subscriptionData.planId,
        status: 'active',
      });
      await newSubscription.save();

      return newSubscription;
    } catch (error) {
      throw new Error(`Subscription creation failed: ${error.message}`);
    }
  }

  /**
   * Handle a refund
   * @param {Object} refundData - Refund details
   * @returns {Promise<Object>} Refund result
   */
  async handleRefund(refundData) {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: refundData.paymentIntentId,
        amount: refundData.amount,
      });

      // Save refund details to the database
      const newRefund = new Refund({
        paymentId: refundData.paymentId,
        amount: refundData.amount,
        status: RefundStatus.COMPLETED,
        transactionId: refund.id,
      });
      await newRefund.save();

      return newRefund;
    } catch (error) {
      throw new Error(`Refund processing failed: ${error.message}`);
    }
  }
}

module.exports = new PaymentService();