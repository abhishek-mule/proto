import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Sprout, Mail, Lock, Eye, EyeOff, 
  User, ShoppingBag, Shield, AlertCircle 
} from 'lucide-react';

const RoleBasedLogin = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState<'consumer' | 'farmer' | 'admin'>('consumer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const roles = [
    {
      id: 'consumer' as const,
      name: 'Consumer',
      description: 'Browse and purchase fresh produce',
      icon: ShoppingBag,
      color: 'blue',
      features: ['Browse marketplace', 'Track orders', 'View supply chain']
    },
    {
      id: 'farmer' as const,
      name: 'Farmer',
      description: 'Manage crops and sell produce',
      icon: Sprout,
      color: 'green',
      features: ['List crops', 'Manage inventory', 'AI assistance']
    },
    {
      id: 'admin' as const,
      name: 'Administrator',
      description: 'Platform management and oversight',
      icon: Shield,
      color: 'purple',
      features: ['User management', 'Analytics', 'System settings']
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login({
        email: formData.email,
        password: formData.password,
        role: selectedRole
      });

      // Navigate based on role
      switch (selectedRole) {
        case 'consumer':
          navigate('/marketplace');
          break;
        case 'farmer':
          navigate('/farmer');
          break;
        case 'admin':
          navigate('/admin');
          break;
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const getColorClasses = (color: string, selected: boolean) => {
    const colors = {
      blue: selected 
        ? 'border-blue-500 bg-blue-50 text-blue-700' 
        : 'border-gray-200 hover:border-blue-300 text-gray-700',
      green: selected 
        ? 'border-green-500 bg-green-50 text-green-700' 
        : 'border-gray-200 hover:border-green-300 text-gray-700',
      purple: selected 
        ? 'border-purple-500 bg-purple-50 text-purple-700' 
        : 'border-gray-200 hover:border-purple-300 text-gray-700'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-green-400/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12 relative z-10">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-green-500 via-green-600 to-blue-600 rounded-2xl shadow-2xl float-animation">
                <Sprout className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl opacity-20 blur-lg"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">AgroChain</h1>
              <p className="text-gray-600 font-medium">Secure Blockchain Agriculture Platform</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600 text-lg">
            {isSignUp ? 'Choose your role and join our platform' : 'Sign in to access your dashboard'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start relative z-10">
          {/* Role Selection */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Select Your Role</h3>
              <div className="space-y-4">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-105 hover-lift ${getColorClasses(role.color, isSelected)}`}
                    >
                      <div className="flex items-start space-x-5">
                        <div className={`p-3 rounded-xl shadow-lg ${
                          isSelected 
                            ? `bg-${role.color}-600 text-white` 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2">{role.name}</h4>
                          <p className="text-sm opacity-80 mb-3">{role.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {role.features.map((feature, index) => (
                              <span
                                key={index}
                                className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                                  isSelected 
                                    ? `bg-${role.color}-100 text-${role.color}-700` 
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Role Benefits */}
            <div className="glass rounded-2xl p-8 border border-gray-200/50 shadow-xl">
              <h4 className="font-bold text-gray-800 mb-4 text-lg">Platform Benefits</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
                  <span>Blockchain-verified transactions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
                  <span>Complete supply chain transparency</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full"></div>
                  <span>Secure digital wallet integration</span>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-gray-100/50">
            {error && (
              <div className="mb-8 p-5 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-700 text-sm font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-base"
                    placeholder={`${selectedRole}@agrochain.com`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-14 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-base"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded-lg focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-gray-600 font-medium">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl ${
                  selectedRole === 'consumer' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' :
                  selectedRole === 'farmer'
                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' :
                    'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                } text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  `Sign in as ${roles.find(r => r.id === selectedRole)?.name}`
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>

            {/* Security Notice */}
            <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">Secure Login</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your data is protected with end-to-end encryption and blockchain security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedLogin;