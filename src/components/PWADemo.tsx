import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Wifi,
  WifiOff,
  Download,
  RefreshCw,
  Bell,
  Share2,
  Zap,
  Shield,
  Clock
} from 'lucide-react';
import usePWA from '../hooks/usePWA';
import PWAInstallPrompt from './PWAInstallPrompt';
import MobileLayout from './MobileLayout';

const PWADemo: React.FC = () => {
  const {
    isInstallable,
    isInstalled,
    isOffline,
    updateAvailable,
    installPWA,
    updatePWA,
    share,
    getNetworkStatus
  } = usePWA();

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [installPromptVisible, setInstallPromptVisible] = useState(false);

  const networkStatus = getNetworkStatus();

  useEffect(() => {
    // Show install prompt after 10 seconds if installable
    const timer = setTimeout(() => {
      if (isInstallable && !isInstalled) {
        setInstallPromptVisible(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled]);

  const handleShare = async () => {
    const shared = await share({
      title: 'PayChain - Blockchain Payment App',
      text: 'Experience secure blockchain payments with our PWA!',
      url: window.location.href
    });

    if (!shared) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const renderDashboard = () => (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to PayChain</h1>
        <p className="text-blue-100">Your blockchain payment companion</p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span className="text-sm">Secure</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span className="text-sm">Fast</span>
          </div>
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5" />
            <span className="text-sm">Mobile</span>
          </div>
        </div>
      </div>

      {/* PWA Status Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            {isOffline ? (
              <WifiOff className="w-8 h-8 text-orange-500" />
            ) : (
              <Wifi className="w-8 h-8 text-green-500" />
            )}
            <div>
              <p className="font-medium text-gray-900">Network</p>
              <p className="text-sm text-gray-600">
                {isOffline ? 'Offline' : 'Online'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <Smartphone className="w-8 h-8 text-blue-500" />
            <div>
              <p className="font-medium text-gray-900">App Status</p>
              <p className="text-sm text-gray-600">
                {isInstalled ? 'Installed' : 'Web App'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Quick Actions</h3>

        <div className="grid grid-cols-2 gap-3">
          {isInstallable && !isInstalled && (
            <button
              onClick={installPWA}
              className="bg-blue-500 text-white p-4 rounded-xl font-medium flex flex-col items-center space-y-2 hover:bg-blue-600 transition-colors"
            >
              <Download className="w-6 h-6" />
              <span className="text-sm">Install App</span>
            </button>
          )}

          {updateAvailable && (
            <button
              onClick={updatePWA}
              className="bg-green-500 text-white p-4 rounded-xl font-medium flex flex-col items-center space-y-2 hover:bg-green-600 transition-colors"
            >
              <RefreshCw className="w-6 h-6" />
              <span className="text-sm">Update App</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="bg-purple-500 text-white p-4 rounded-xl font-medium flex flex-col items-center space-y-2 hover:bg-purple-600 transition-colors"
          >
            <Share2 className="w-6 h-6" />
            <span className="text-sm">Share App</span>
          </button>

          <button
            onClick={() => setCurrentPage('wallet')}
            className="bg-gray-500 text-white p-4 rounded-xl font-medium flex flex-col items-center space-y-2 hover:bg-gray-600 transition-colors"
          >
            <Shield className="w-6 h-6" />
            <span className="text-sm">Open Wallet</span>
          </button>
        </div>
      </div>

      {/* PWA Features */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">PWA Features</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Offline Support</span>
            <div className={`w-3 h-3 rounded-full ${isOffline ? 'bg-orange-500' : 'bg-green-500'}`} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Installable</span>
            <div className={`w-3 h-3 rounded-full ${isInstallable ? 'bg-green-500' : 'bg-gray-400'}`} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">App Installed</span>
            <div className={`w-3 h-3 rounded-full ${isInstalled ? 'bg-green-500' : 'bg-gray-400'}`} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Update Available</span>
            <div className={`w-3 h-3 rounded-full ${updateAvailable ? 'bg-blue-500' : 'bg-gray-400'}`} />
          </div>
        </div>
      </div>

      {/* Network Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Network Info</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Online:</span>
            <span className={networkStatus.online ? 'text-green-600' : 'text-red-600'}>
              {networkStatus.online ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Connection:</span>
            <span className="text-gray-900">
              {networkStatus.connection?.effectiveType || 'Unknown'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Downlink:</span>
            <span className="text-gray-900">
              {networkStatus.connection?.downlink || 'N/A'} Mbps
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWallet = () => (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Wallet</h2>
        <p className="text-gray-600 mb-4">
          Connect your MetaMask wallet to start making blockchain payments.
        </p>
        <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors">
          Connect Wallet
        </button>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'wallet':
        return renderWallet();
      default:
        return renderDashboard();
    }
  };

  return (
    <>
      <MobileLayout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </MobileLayout>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt
        onClose={() => setInstallPromptVisible(false)}
      />

      {/* Offline Notification */}
      {isOffline && (
        <div className="fixed top-16 left-4 right-4 bg-orange-500 text-white p-3 rounded-lg shadow-lg z-40">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-5 h-5" />
            <span className="text-sm font-medium">You're offline</span>
          </div>
          <p className="text-sm opacity-90 mt-1">
            Some features may be limited. Data will sync when connection is restored.
          </p>
        </div>
      )}

      {/* Update Available Notification */}
      {updateAvailable && (
        <div className="fixed top-16 left-4 right-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg z-40">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5" />
            <span className="text-sm font-medium">Update Available</span>
          </div>
          <p className="text-sm opacity-90 mt-1">
            A new version is available. Refresh to update.
          </p>
          <button
            onClick={updatePWA}
            className="mt-2 bg-white text-blue-500 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50 transition-colors"
          >
            Update Now
          </button>
        </div>
      )}
    </>
  );
};

export default PWADemo;