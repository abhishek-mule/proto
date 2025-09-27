import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, Mail, Lock, Sprout, Shield, Leaf, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('consumer');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isSignUp) {
      // Validation for signup
      if (!email || !password || !confirmPassword || !name) {
        setError('All fields are required');
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
      
      // Call signup API
      setIsLoading(true);
      try {
        if (auth) {
          await auth.signup({ name, email, password, role });
          navigate('/marketplace');
        }
      } catch (err: any) {
        setError(err.message || 'Signup failed');
        setIsLoading(false);
      }
    } else {
      // Login logic
      if (!email || !password) {
        setError('Email and password are required');
        return;
      }
      
      setIsLoading(true);
      try {
        if (auth) {
          await auth.login({ email, password, role });
          navigate('/marketplace');
        }
      } catch (err: any) {
        setError(err.message || 'Login failed');
        setIsLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleWalletConnect = async () => {
    try {
      if (auth) {
        const connection = await auth.connectWallet();
        console.log('Wallet connected:', connection);
        navigate('/marketplace');
      }
    } catch (err: any) {
      setError(err.message || 'Wallet connection failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100 flex items-center justify-center px-4 py-10">
      <div className="max-w-6xl w-full flex items-center justify-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Hero Section */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <div className="p-3 bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg">
                  <Sprout className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">AgroChain</h1>
                  <p className="text-gray-600">Blockchain-Powered Agriculture</p>
                </div>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                Transparent
                <span className="text-green-600"> Farm-to-Fork</span> Journey
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Connect with trusted farmers, trace your food's journey, and support sustainable agriculture through blockchain technology.
              </p>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-5 border border-green-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <Shield className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-800">Verified Supply Chain</h3>
                <p className="text-sm text-gray-600">Every step tracked on blockchain</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-5 border border-green-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <Leaf className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-800">Sustainable Farming</h3>
                <p className="text-sm text-gray-600">Supporting eco-friendly practices</p>
              </div>
            </div>
          </div>

          {/* Login/Signup Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800">
                  {isSignUp ? 'Join AgroChain' : 'Welcome Back'}
                </h3>
                <p className="text-gray-600 mt-1">
                  {isSignUp ? 'Create your account to get started' : 'Sign in to your account'}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Wallet Connect */}
              <button 
                onClick={handleWalletConnect}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 group shadow-md"
              >
                <Wallet className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Connect Crypto Wallet</span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500">or continue with email</span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="farmer@agrochain.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-3"
                    >
                      {showPassword ? 
                        <EyeOff className="h-5 w-5 text-gray-400" /> : 
                        <Eye className="h-5 w-5 text-gray-400" />
                      }
                    </button>
                  </div>
                </div>

                {isSignUp && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">I am a:</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setRole('farmer')}
                          className={`py-2 px-4 rounded-lg border ${
                            role === 'farmer' 
                              ? 'bg-green-100 border-green-300 text-green-700' 
                              : 'bg-white border-gray-300 text-gray-700'
                          } hover:bg-green-50 transition-colors`}
                        >
                          Farmer
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole('consumer')}
                          className={`py-2 px-4 rounded-lg border ${
                            role === 'consumer' 
                              ? 'bg-blue-100 border-blue-300 text-blue-700' 
                              : 'bg-white border-gray-300 text-gray-700'
                          } hover:bg-blue-50 transition-colors`}
                        >
                          Consumer
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {!isSignUp && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-green-600 hover:text-green-700">Forgot password?</a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 text-center block shadow-md ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
                </button>
              </form>

              <div className="text-center">
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                  className="text-sm text-green-600 hover:text-green-800 font-medium"
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>

              {/* Quick Access */}
              <div className="border-t pt-4 space-y-2">
                <p className="text-xs text-gray-500 text-center mb-3">Quick Demo Access</p>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/farmer"
                    className="bg-green-100 text-green-700 py-2 px-3 rounded-md text-sm font-medium text-center hover:bg-green-200 transition-colors shadow-sm"
                  >
                    Farmer View
                  </Link>
                  <Link
                    to="/marketplace"
                    className="bg-blue-100 text-blue-700 py-2 px-3 rounded-md text-sm font-medium text-center hover:bg-blue-200 transition-colors shadow-sm"
                  >
                    Consumer View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;