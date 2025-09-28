// Service Worker Registration with comprehensive error handling
export function registerServiceWorker() {
  // Skip SW registration in Chrome extension context
  if (window.location.protocol === 'chrome-extension:' || 
      window.location.protocol === 'moz-extension:' ||
      window.chrome?.extension) {
    console.warn('SW registration skipped for browser extension context');
    return;
  }

  if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('✅ SW registered successfully:', registration.scope);
          
          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('🔄 New SW available, will reload on next visit');
                }
              });
            }
          });
        })
        .catch(error => {
          console.error('❌ SW registration failed:', error);
        });
    });
  } else {
    console.warn('⚠️ Service Worker not supported or not on HTTPS');
  }
}

// Extension context detection and API safeguards
export function isExtensionContext(): boolean {
  return !!(window.chrome?.extension || 
           window.location.protocol === 'chrome-extension:' ||
           window.location.protocol === 'moz-extension:');
}

// Safe Chrome API wrapper
export function safeChromeAPI() {
  if (!isExtensionContext() || !window.chrome?.tabs) {
    return null;
  }

  return {
    getCurrentTab: () => new Promise((resolve, reject) => {
      if (!chrome.tabs?.getCurrent) {
        reject(new Error('Chrome tabs API not available'));
        return;
      }
      
      chrome.tabs.getCurrent((tab) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (tab) {
          resolve(tab);
        } else {
          reject(new Error('No active tab found'));
        }
      });
    }),
    
    getTab: (tabId: number) => new Promise((resolve, reject) => {
      if (!chrome.tabs?.get || tabId < 0) {
        reject(new Error('Invalid tab ID or Chrome tabs API not available'));
        return;
      }
      
      chrome.tabs.get(tabId, (tab) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(tab);
        }
      });
    })
  };
}
