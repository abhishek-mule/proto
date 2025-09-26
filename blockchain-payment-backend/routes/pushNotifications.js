const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const PushNotificationService = require('../services/pushNotificationService');
const Subscription = require('../models/Subscription');

/**
 * @route   GET /api/notifications/public-key
 * @desc    Get the public VAPID key
 * @access  Public
 */
router.get('/public-key', (req, res) => {
  try {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    if (!publicKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }
    res.json({ publicKey });
  } catch (error) {
    console.error('Error getting public key:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/notifications/subscribe
 * @desc    Subscribe to push notifications
 * @access  Private
 */
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { subscription } = req.body;
    const userId = req.user.id;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Invalid subscription object' });
    }

    // Save the subscription
    await PushNotificationService.subscribe(subscription, userId);
    
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    res.status(500).json({ error: 'Failed to subscribe to push notifications' });
  }
});

/**
 * @route   POST /api/notifications/unsubscribe
 * @desc    Unsubscribe from push notifications
 * @access  Private
 */
router.post('/unsubscribe', auth, async (req, res) => {
  try {
    const { endpoint } = req.body;
    const userId = req.user.id;

    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint is required' });
    }

    // Verify the subscription belongs to the user
    const subscription = await Subscription.findOne({
      'subscription.endpoint': endpoint,
      user: userId
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Delete the subscription
    await PushNotificationService.unsubscribe(endpoint);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    res.status(500).json({ error: 'Failed to unsubscribe from push notifications' });
  }
});

/**
 * @route   POST /api/notifications/test
 * @desc    Send a test notification to the authenticated user
 * @access  Private
 */
router.post('/test', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    await PushNotificationService.sendNotificationToUser(userId, {
      title: 'Test Notification',
      body: 'This is a test notification from your application!',
      icon: '/icons/icon-192x192.png',
      url: '/'
    });
    
    res.json({ success: true, message: 'Test notification sent' });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ error: 'Failed to send test notification' });
  }
});

module.exports = router;
