import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleBasedLogin from './components/auth/RoleBasedLogin';
import FarmerNFTDashboard from './components/farmer/FarmerNFTDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import NFTMarketplace from './components/nft/NFTMarketplace';
import ProductPage from './components/consumer/ProductPage';
import WalletConnection from './components/wallet/WalletConnection';
import BottomNavigation from './components/common/BottomNavigation';
import PWAHome from './components/PWAHome';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { warmUpServer } from './services/apiClient';

import { useAuth } from './contexts/AuthContext';

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

function AppContent() {
  // Check if device is mobile
  const isMobile = window.innerWidth < 768;
  const { user } = useAuth();

  // Warm up server on app start to prevent cold start delays
  useEffect(() => {
    warmUpServer();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-forest-50 via-white to-harvest-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        {!isMobile && <Header />}
        <Routes>
          <Route path="/" element={isMobile ? <PWAHome /> : <RoleBasedLogin />} />
          <Route path="/pwa-demo" element={<PWAHome />} />
          <Route path="/login" element={<RoleBasedLogin />} />
          
          {/* Consumer Routes */}
          <Route 
            path="/marketplace" 
            element={
              <ProtectedRoute allowedRoles={['consumer', 'farmer', 'admin']}>
                <NFTMarketplace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/product/:id" 
            element={
              <ProtectedRoute allowedRoles={['consumer', 'farmer', 'admin']}>
                <ProductPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Farmer Routes */}
          <Route 
            path="/farmer" 
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <FarmerNFTDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Profile Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['consumer', 'farmer', 'admin']}>
                <div className="max-w-2xl mx-auto px-4 py-8">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-soft border border-gray-100 dark:border-gray-700">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">User Profile</h1>
                    <p className="text-gray-600 dark:text-gray-400">Welcome to your profile page! Here you can manage your account settings and preferences.</p>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Wallet Connection */}
          <Route
            path="/wallet-connect"
            element={
              <ProtectedRoute>
                <div className="max-w-2xl mx-auto px-4 py-8">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-soft border border-gray-100 dark:border-gray-700">
                    <WalletConnection />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          
          {/* Settings Route */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['consumer', 'farmer', 'admin']}>
                <div className="max-w-2xl mx-auto px-4 py-8">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-soft border border-gray-100 dark:border-gray-700">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your preferences and application settings.</p>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
        {user && <BottomNavigation />}
      </div>
    </Router>
  );
}

export default App;
