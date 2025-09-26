class PushNotificationManager {
  constructor() {
    this.publicVapidKey = '';
    this.isSubscribed = false;
    this.registration = null;
    this.userId = null; // Will be set after authentication
    
    // Bind methods
    this.init = this.init.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.updateSubscription = this.updateSubscription.bind(this);
    this.updateUI = this.updateUI.bind(this);
    
    // Initialize when the service worker is ready
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      this.init();
    } else {
      console.warn('Push notifications are not supported in this browser');
    }
  }
  
  /**
   * Initialize the push notification manager
   */
  async init() {
    try {
      // Get the public VAPID key from the server
      const response = await fetch('/api/notifications/public-key');
      const data = await response.json();
      this.publicVapidKey = data.publicKey;
      
      // Register the service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');
      
      // Check if we have a subscription
      const subscription = await this.registration.pushManager.getSubscription();
      this.isSubscribed = !(subscription === null);
      
      // Update the UI
      this.updateUI();
      
      // Listen for the user to click the subscribe button
      const subscribeBtn = document.getElementById('enable-notifications');
      if (subscribeBtn) {
        subscribeBtn.addEventListener('click', () => {
          if (this.isSubscribed) {
            this.unsubscribe();
          } else {
            this.subscribe();
          }
        });
      }
      
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }
  
  /**
   * Subscribe to push notifications
   */
  async subscribe() {
    try {
      if (!this.publicVapidKey) {
        throw new Error('Public VAPID key is not available');
      }
      
      // Get the service worker registration
      if (!this.registration) {
        throw new Error('Service Worker not registered');
      }
      
      // Subscribe to push notifications
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.publicVapidKey)
      });
      
      // Send the subscription to the server
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ subscription })
      });
      
      this.isSubscribed = true;
      this.updateUI();
      
      console.log('Subscribed to push notifications');
      this.showNotification('Success', 'You have successfully subscribed to push notifications');
      
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      this.showNotification('Error', 'Failed to subscribe to push notifications');
    }
  }
  
  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        // Unsubscribe from the push service
        await subscription.unsubscribe();
        
        // Remove the subscription from the server
        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ endpoint: subscription.endpoint })
        });
        
        this.isSubscribed = false;
        this.updateUI();
        
        console.log('Unsubscribed from push notifications');
        this.showNotification('Success', 'You have unsubscribed from push notifications');
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      this.showNotification('Error', 'Failed to unsubscribe from push notifications');
    }
  }
  
  /**
   * Update the subscription on the server
   */
  async updateSubscription() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription && this.userId) {
        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ subscription })
        });
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  }
  
  /**
   * Update the UI based on subscription state
   */
  updateUI() {
    const subscribeBtn = document.getElementById('enable-notifications');
    if (subscribeBtn) {
      if (this.isSubscribed) {
        subscribeBtn.textContent = 'Disable Notifications';
        subscribeBtn.classList.remove('btn-primary');
        subscribeBtn.classList.add('btn-secondary');
      } else {
        subscribeBtn.textContent = 'Enable Notifications';
        subscribeBtn.classList.remove('btn-secondary');
        subscribeBtn.classList.add('btn-primary');
      }
    }
  }
  
  /**
   * Show a notification to the user
   */
  showNotification(title, options) {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
      return;
    }
    
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, options);
      
      // Handle notification click
      notification.onclick = function(event) {
        event.preventDefault();
        window.focus();
        if (options.url) {
          window.open(options.url, '_blank');
        }
      };
    }
  }
  
  /**
   * Convert a base64 string to a Uint8Array
   */
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  }
  
  /**
   * Set the current user ID
   */
  setUserId(userId) {
    this.userId = userId;
    if (userId) {
      this.updateSubscription();
    }
  }
}

// Initialize the push notification manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.pushNotificationManager = new PushNotificationManager();
  
  // If the user is logged in, set the user ID
  const token = localStorage.getItem('token');
  if (token) {
    // You might need to decode the JWT to get the user ID
    // This is a simplified example
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.id) {
        window.pushNotificationManager.setUserId(payload.id);
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }
  }
});
