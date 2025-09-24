import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/common/Header';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleBasedLogin from './components/auth/RoleBasedLogin';
import FarmerNFTDashboard from './components/farmer/FarmerNFTDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import NFTMarketplace from './components/nft/NFTMarketplace';
import ProductPage from './components/consumer/ProductPage';
import WalletConnection from './components/wallet/WalletConnection';
import BottomNavigation from './components/common/BottomNavigation';
import PWADemo from './components/PWADemo';

function App() {
  // Check if device is mobile
  const isMobile = window.innerWidth < 768;

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-yellow-50">
          {!isMobile && <Header />}
          <Routes>
            <Route path="/" element={isMobile ? <PWADemo /> : <RoleBasedLogin />} />
            <Route path="/pwa-demo" element={<PWADemo />} />
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
          <BottomNavigation />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;