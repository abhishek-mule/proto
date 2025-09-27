import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sprout, Wallet, User, ShoppingBag, Shield, LogOut, Menu, X, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import WalletConnection from '../wallet/WalletConnection';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, walletConnection } = useAuth();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Don't show header on login page
  if (location.pathname === '/login' || location.pathname === '/') {
    return null;
  }

  return (
    <>
      <header className={`${scrolled ? 'bg-white/95 shadow-lg' : 'bg-white/80'} backdrop-blur-md border-b border-gray-100/50 sticky top-0 z-40 pb-safe transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-18">
            {/* Logo */}
            <Link to={
              user?.role === 'farmer' ? '/farmer' :
              user?.role === 'admin' ? '/admin' : '/marketplace'
            } className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                  <Sprout className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">AgroChain</h1>
                <p className="text-xs text-gray-500 font-medium">Farm to Fork Transparency</p>
              </div>
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Desktop Navigation */}
            {isAuthenticated && (
              <nav className="hidden md:flex space-x-2">
                {(user?.role === 'consumer' || user?.role === 'farmer' || user?.role === 'admin') && (
                  <Link
                    to="/marketplace"
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                      isActive('/marketplace')
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <ShoppingBag className="h-4 w-4" />
                      <span>Marketplace</span>
                    </div>
                  </Link>
                )}
                
                {user?.role === 'farmer' && (
                  <Link
                    to="/farmer"
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                      isActive('/farmer')
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Farm Dashboard</span>
                    </div>
                  </Link>
                )}
                
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                      isActive('/admin')
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>Admin Panel</span>
                    </div>
                  </Link>
                )}
              </nav>
            )}

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  {/* Wallet Status */}
                  <button
                    onClick={() => setShowWalletModal(true)}
                    className={`hidden md:flex items-center space-x-2 rounded-xl px-3 md:px-4 py-2 md:py-2.5 transition-all duration-300 hover:scale-105 text-sm ${
                      walletConnection 
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 hover:from-green-200 hover:to-emerald-200 shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Wallet className="h-4 w-4" />
                    <span className="text-sm">
                      {walletConnection 
                        ? `${walletConnection.address.slice(0, 6)}...${walletConnection.address.slice(-4)}`
                        : 'Connect Wallet'
                      }
                    </span>
                    {walletConnection && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
                  </button>
                  
                  {/* User Menu */}
                  <div className="flex items-center space-x-3">
                    <div className="hidden lg:block text-right">
                      <p className="text-sm font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize font-medium">{user.role}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 md:px-4 py-2 md:py-2.5 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-1 md:space-x-2 text-sm"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden md:inline">Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-3 px-4 shadow-lg">
            <nav className="flex flex-col space-y-2">
              {(user?.role === 'consumer' || user?.role === 'farmer' || user?.role === 'admin') && (
                <Link
                  to="/marketplace"
                  className={`px-4 py-2.5 rounded-lg font-medium ${
                    isActive('/marketplace')
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : 'text-gray-600 bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <ShoppingBag className="h-5 w-5" />
                    <span>Marketplace</span>
                  </div>
                </Link>
              )}
              
              {user?.role === 'farmer' && (
                <Link
                  to="/farmer"
                  className={`px-4 py-2.5 rounded-lg font-medium ${
                    isActive('/farmer')
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                      : 'text-gray-600 bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5" />
                    <span>Farm Dashboard</span>
                  </div>
                </Link>
              )}
              
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`px-4 py-2.5 rounded-lg font-medium ${
                    isActive('/admin')
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                      : 'text-gray-600 bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5" />
                    <span>Admin Panel</span>
                  </div>
                </Link>
              )}
              
              {isAuthenticated && (
                <>
                  <button
                    onClick={() => {
                      setShowWalletModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-2.5 rounded-lg font-medium text-gray-600 bg-gray-50"
                  >
                    <Wallet className="h-5 w-5" />
                    <span>
                      {walletConnection 
                        ? `Wallet: ${walletConnection.address.slice(0, 6)}...${walletConnection.address.slice(-4)}`
                        : 'Connect Wallet'
                      }
                    </span>
                  </button>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-red-500 to-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>
      
      {/* Wallet Modal */}
      {showWalletModal && (
        <WalletConnection 
          showAsModal={true}
          onClose={() => setShowWalletModal(false)} 
        />
      )}
    </>
  );
};

export default Header;