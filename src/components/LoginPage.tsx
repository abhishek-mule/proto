import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Mail, Lock, Sprout, Shield, Leaf } from 'lucide-react';

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full flex items-center justify-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Hero Section */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <div className="p-3 bg-gradient-to-r from-green-600 to-green-700 rounded-xl">
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
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-green-100">
                <Shield className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-800">Verified Supply Chain</h3>
                <p className="text-sm text-gray-600">Every step tracked on blockchain</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-green-100">
                <Leaf className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-800">Sustainable Farming</h3>
                <p className="text-sm text-gray-600">Supporting eco-friendly practices</p>
              </div>
            </div>
          </div>

          {/* Login Form */}
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

              {/* Wallet Connect */}
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 group">
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
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="farmer@agrochain.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700">Forgot password?</a>
                </div>

                <Link
                  to="/marketplace"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 text-center block"
                >
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Link>
              </form>

              <div className="text-center">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>

              {/* Quick Access */}
              <div className="border-t pt-4 space-y-2">
                <p className="text-xs text-gray-500 text-center mb-3">Quick Demo Access</p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/farmer"
                    className="bg-green-100 text-green-700 py-2 px-3 rounded-md text-sm font-medium text-center hover:bg-green-200 transition-colors"
                  >
                    Farmer View
                  </Link>
                  <Link
                    to="/marketplace"
                    className="bg-blue-100 text-blue-700 py-2 px-3 rounded-md text-sm font-medium text-center hover:bg-blue-200 transition-colors"
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