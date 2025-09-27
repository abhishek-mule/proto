// Service Worker Registration with error handling
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(error => {
          // Handle Chrome extension scheme errors
          if (error.message && error.message.includes('chrome-extension')) {
            console.warn('SW registration skipped for Chrome extension context');
          } else {
            console.error('SW registration failed: ', error);
          }
        });
    });
  }
}