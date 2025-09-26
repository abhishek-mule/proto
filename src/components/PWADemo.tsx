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
  Clock,
  Home,
  BarChart3,
  Wallet,
  Settings,
  User,
  ChevronRight,
  ArrowUpRight,
  Sparkles
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
      {/* Welcome Section - Modern Glassmorphism Design */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-10 backdrop-blur-xl"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">PWA Enabled</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to PayChain</h1>
          <p className="text-blue-100 mb-4">Your blockchain payment companion</p>
          <div className="mt-4 flex items-center space-x-6">
            <div className="flex flex-col items-center">
              <Shield className="w-6 h-6 mb-1 text-blue-200" />
              <span className="text-xs font-medium">Secure</span>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="w-6 h-6 mb-1 text-yellow-300" />
              <span className="text-xs font-medium">Fast</span>
            </div>
            <div className="flex flex-col items-center">
              <Smartphone className="w-6 h-6 mb-1 text-green-300" />
              <span className="text-xs font-medium">Mobile</span>
            </div>
          </div>
        </div>
      </div>

      {/* App Status Cards - Neumorphic Design */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white rounded-full shadow-sm">
              {isOffline ? (
                <WifiOff className="w-6 h-6 text-orange-500" />
              ) : (
                <Wifi className="w-6 h-6 text-green-500" />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">Network</p>
              <p className="text-sm text-gray-600 flex items-center">
                {isOffline ? 'Offline' : 'Online'}
                <span className={`ml-2 w-2 h-2 rounded-full ${isOffline ? 'bg-orange-500' : 'bg-green-500'} animate-pulse`}></span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <Smartphone className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">App Status</p>
              <p className="text-sm text-gray-600 flex items-center">
                {isInstalled ? 'Installed' : 'Web App'}
                <span className={`ml-2 w-2 h-2 rounded-full ${isInstalled ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Modern Card Design */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <Zap className="w-4 h-4 mr-2 text-yellow-500" />
          Quick Actions
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {isInstallable && !isInstalled && (
            <button
              onClick={installPWA}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl font-medium flex flex-col items-center space-y-2 hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <Download className="w-6 h-6" />
              <span className="text-sm">Install App</span>
            </button>
          )}

          {updateAvailable && (
            <button
              onClick={updatePWA}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl font-medium flex flex-col items-center space-y-2 hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <RefreshCw className="w-6 h-6" />
              <span className="text-sm">Update App</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl font-medium flex flex-col items-center space-y-2 hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <Share2 className="w-6 h-6" />
            <span className="text-sm">Share App</span>
          </button>

          <button
            onClick={() => setCurrentPage('wallet')}
            className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-4 rounded-xl font-medium flex flex-col items-center space-y-2 hover:from-gray-800 hover:to-gray-900 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <Shield className="w-6 h-6" />
            <span className="text-sm">Open Wallet</span>
          </button>
        </div>
      </div>

      {/* PWA Features - Modern List */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
          PWA Features
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-gray-700 font-medium flex items-center">
              <WifiOff className="w-4 h-4 mr-2 text-gray-500" />
              Offline Support
            </span>
            <div className={`w-10 h-5 rounded-full flex items-center ${isOffline ? 'bg-orange-200' : 'bg-green-200'} px-1`}>
              <div className={`w-3 h-3 rounded-full transition-all ${isOffline ? 'bg-orange-500 ml-0' : 'bg-green-500 ml-5'}`} />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-gray-700 font-medium flex items-center">
              <Download className="w-4 h-4 mr-2 text-gray-500" />
              Installable
            </span>
            <div className={`w-10 h-5 rounded-full flex items-center ${isInstallable ? 'bg-green-200' : 'bg-gray-200'} px-1`}>
              <div className={`w-3 h-3 rounded-full transition-all ${isInstallable ? 'bg-green-500 ml-5' : 'bg-gray-400 ml-0'}`} />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-gray-700 font-medium flex items-center">
              <Smartphone className="w-4 h-4 mr-2 text-gray-500" />
              App Installed
            </span>
            <div className={`w-10 h-5 rounded-full flex items-center ${isInstalled ? 'bg-green-200' : 'bg-gray-200'} px-1`}>
              <div className={`w-3 h-3 rounded-full transition-all ${isInstalled ? 'bg-green-500 ml-5' : 'bg-gray-400 ml-0'}`} />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-gray-700 font-medium flex items-center">
              <RefreshCw className="w-4 h-4 mr-2 text-gray-500" />
              Update Available
            </span>
            <div className={`w-10 h-5 rounded-full flex items-center ${updateAvailable ? 'bg-blue-200' : 'bg-gray-200'} px-1`}>
              <div className={`w-3 h-3 rounded-full transition-all ${updateAvailable ? 'bg-blue-500 ml-5' : 'bg-gray-400 ml-0'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Network Information - Modern Card */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Wifi className="w-4 h-4 mr-2 text-blue-500" />
          Network Info
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center p-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Status</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${networkStatus.online ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {networkStatus.online ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Connection</span>
            <span className="text-gray-900 font-medium">
              {networkStatus.connection?.effectiveType || 'Unknown'}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Downlink</span>
            <span className="text-gray-900 font-medium">
              {networkStatus.connection?.downlink || 'N/A'} Mbps
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWallet = () => (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Wallet className="w-5 h-5 mr-2 text-purple-500" />
          Wallet
        </h2>
        <p className="text-gray-600 mb-6">
          Connect your MetaMask wallet to start making blockchain payments.
        </p>
        <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1">
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

      {/* Offline Notification - Enhanced */}
      {isOffline && (
        <div className="fixed top-16 left-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl shadow-lg z-40 animate-fade-in">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-5 h-5" />
            <span className="text-sm font-medium">You're offline</span>
          </div>
          <p className="text-sm opacity-90 mt-1">
            Some features may be limited. Data will sync when connection is restored.
          </p>
        </div>
      )}

      {/* Update Available Notification - Enhanced */}
      {updateAvailable && (
        <div className="fixed top-16 left-4 right-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-xl shadow-lg z-40 animate-fade-in">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5" />
            <span className="text-sm font-medium">Update Available</span>
          </div>
          <p className="text-sm opacity-90 mt-1">
            A new version is available. Refresh to update.
          </p>
          <button
            onClick={updatePWA}
            className="mt-2 bg-white text-indigo-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors shadow-sm"
          >
            Update Now
          </button>
        </div>
      )}
    </>
  );
};

export default PWADemo;