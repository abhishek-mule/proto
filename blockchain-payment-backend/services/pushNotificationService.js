const webpush = require('web-push');
const Subscription = require('../models/Subscription');

// Configure web-push with VAPID details from environment variables
const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

if (!publicVapidKey || !privateVapidKey) {
  console.error('VAPID keys are not set. Please run `npm run generate-vapid-keys`');
  process.exit(1);
}

webpush.setVapidDetails(
  process.env.VAPID_MAILTO || 'mailto:example@yourdomain.com',
  publicVapidKey,
  privateVapidKey
);

class PushNotificationService {
  /**
   * Subscribe a user to push notifications
   * @param {Object} subscription - The push subscription object from the client
   * @param {string} userId - The user ID to associate with this subscription
   * @returns {Promise<Object>} - The saved subscription
   */
  static async subscribe(subscription, userId) {
    try {
      // Check if subscription already exists
      const existingSubscription = await Subscription.findOne({
        'subscription.endpoint': subscription.endpoint,
        user: userId
      });

      if (existingSubscription) {
        return existingSubscription;
      }

      // Create new subscription
      const newSubscription = new Subscription({
        user: userId,
        subscription: subscription
      });

      return await newSubscription.save();
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe a user from push notifications
   * @param {string} endpoint - The push subscription endpoint to remove
   * @returns {Promise<boolean>} - True if unsubscribed successfully
   */
  static async unsubscribe(endpoint) {
    try {
      await Subscription.deleteOne({ 'subscription.endpoint': endpoint });
      return true;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      throw error;
    }
  }

  /**
   * Send a push notification to a specific user
   * @param {string} userId - The user ID to send the notification to
   * @param {Object} payload - The notification payload
   * @param {string} payload.title - The notification title
   * @param {string} payload.body - The notification body
   * @param {string} payload.icon - URL of the notification icon
   * @param {string} payload.url - URL to open when notification is clicked
   * @returns {Promise<Array>} - Array of send results
   */
  static async sendNotificationToUser(userId, { title, body, icon, url }) {
    try {
      const subscriptions = await Subscription.find({ user: userId });
      
      if (subscriptions.length === 0) {
        console.log('No active subscriptions found for user:', userId);
        return [];
      }

      const notificationPayload = JSON.stringify({
        title,
        body,
        icon: icon || '/icons/icon-192x192.png',
        data: { url: url || '/' }
      });

      // Send notification to all user's devices
      const sendPromises = subscriptions.map(subscription => {
        return webpush.sendNotification(subscription.subscription, notificationPayload)
          .catch(error => {
            // If the subscription is no longer valid, remove it
            if (error.statusCode === 410) {
              console.log('Removing invalid subscription:', subscription._id);
              return this.unsubscribe(subscription.subscription.endpoint);
            }
            console.error('Error sending notification:', error);
            return error;
          });
      });

      return await Promise.all(sendPromises);
    } catch (error) {
      console.error('Error in sendNotificationToUser:', error);
      throw error;
    }
  }

  /**
   * Broadcast a notification to all subscribed users
   * @param {Object} payload - The notification payload
   * @returns {Promise<Array>} - Array of send results
   */
  static async broadcastNotification(payload) {
    try {
      const subscriptions = await Subscription.find({});
      const results = [];
      
      for (const subscription of subscriptions) {
        try {
          const result = await this.sendNotificationToUser(
            subscription.user,
            payload
          );
          results.push(...result);
        } catch (error) {
          console.error('Error broadcasting to user:', subscription.user, error);
          results.push({ error: true, userId: subscription.user, message: error.message });
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error in broadcastNotification:', error);
      throw error;
    }
  }
}

module.exports = PushNotificationService;
