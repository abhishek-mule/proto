import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/common/Header';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleBasedLogin from './components/auth/RoleBasedLogin';
import FarmerDashboard from './components/farmer/FarmerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import Marketplace from './components/consumer/Marketplace';
import ProductPage from './components/consumer/ProductPage';
import WalletConnection from './components/wallet/WalletConnection';
import BottomNavigation from './components/common/BottomNavigation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50">
          <Header />
          <Routes>
            <Route path="/" element={<RoleBasedLogin />} />
            <Route path="/login" element={<RoleBasedLogin />} />
            
            {/* Consumer Routes */}
            <Route 
              path="/marketplace" 
              element={
                <ProtectedRoute allowedRoles={['consumer', 'farmer', 'admin']}>
                  <Marketplace />
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
                  <FarmerDashboard />
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