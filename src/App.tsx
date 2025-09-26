import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
// Ensure React is properly imported and used
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

import { useAuth } from './contexts/AuthContext';

function App() {
  // Check if device is mobile
  const isMobile = window.innerWidth < 768;
  const { user } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-yellow-50">
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
                    <h1>User Profile</h1>
                    <p>Welcome to your profile page!</p>
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
                    <WalletConnection />
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
          {user && <BottomNavigation />}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;