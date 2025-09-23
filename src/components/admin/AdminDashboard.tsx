import React, { useState } from 'react';
import { 
  Users, ShoppingBag, TrendingUp, DollarSign, 
  Shield, Settings, BarChart3, AlertTriangle,
  CheckCircle, Clock, Eye, UserCheck
} from 'lucide-react';

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  const stats = [
    { label: 'Total Users', value: '2,847', change: '+12%', icon: Users, color: 'blue' },
    { label: 'Active Farmers', value: '342', change: '+8%', icon: UserCheck, color: 'green' },
    { label: 'Total Orders', value: '1,256', change: '+23%', icon: ShoppingBag, color: 'purple' },
    { label: 'Platform Revenue', value: '$45,230', change: '+18%', icon: DollarSign, color: 'amber' },
  ];

  const recentUsers = [
    { id: 1, name: 'John Smith', role: 'farmer', status: 'verified', joinDate: '2024-01-15' },
    { id: 2, name: 'Sarah Johnson', role: 'consumer', status: 'pending', joinDate: '2024-01-14' },
    { id: 3, name: 'Mike Chen', role: 'farmer', status: 'verified', joinDate: '2024-01-13' },
    { id: 4, name: 'Emma Davis', role: 'consumer', status: 'verified', joinDate: '2024-01-12' },
  ];

  const systemAlerts = [
    { id: 1, type: 'warning', message: 'High server load detected', time: '2 minutes ago' },
    { id: 2, type: 'info', message: 'New farmer verification pending', time: '15 minutes ago' },
    { id: 3, type: 'success', message: 'Payment system updated successfully', time: '1 hour ago' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'transactions', label: 'Transactions', icon: DollarSign },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6 md:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">Platform management and oversight</p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl p-3 md:p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-700" />
                <span className="text-sm font-medium text-purple-800">System Status: Healthy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            purple: 'from-purple-500 to-purple-600',
            amber: 'from-amber-500 to-amber-600',
          };
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs md:text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`p-2 md:p-3 rounded-xl bg-gradient-to-r ${colors[stat.color as keyof typeof colors]}`}>
                  <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 md:mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto px-4 md:px-6 scrollbar-hide">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-3 md:py-4 px-3 md:px-2 border-b-2 font-medium text-xs md:text-sm transition-colors flex items-center space-x-1 md:space-x-2 whitespace-nowrap ${
                    selectedTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline md:hidden lg:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4 md:p-6">
          {selectedTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {recentUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'verified' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{user.joinDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Alerts */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">System Alerts</h3>
                <div className="space-y-3">
                  {systemAlerts.map(alert => (
                    <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                      alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                      alert.type === 'info' ? 'bg-blue-50 border-blue-400' :
                      'bg-green-50 border-green-400'
                    }`}>
                      <div className="flex items-start space-x-2">
                        {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />}
                        {alert.type === 'info' && <Clock className="h-4 w-4 text-blue-600 mt-0.5" />}
                        {alert.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />}
                        <div>
                          <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">User Management</h3>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Export Users
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    Add User
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">User management interface would be implemented here</p>
              </div>
            </div>
          )}

          {selectedTab === 'transactions' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Transaction Management</h3>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Generate Report
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Transaction monitoring and management tools</p>
              </div>
            </div>
          )}

          {selectedTab === 'security' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Security Center</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <h4 className="font-semibold text-green-800">System Security</h4>
                  </div>
                  <div className="space-y-2 text-sm text-green-700">
                    <div>✓ SSL Certificate Active</div>
                    <div>✓ Firewall Protection Enabled</div>
                    <div>✓ Regular Security Scans</div>
                    <div>✓ Two-Factor Authentication</div>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Shield className="h-6 w-6 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">Blockchain Security</h4>
                  </div>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div>✓ Smart Contract Audited</div>
                    <div>✓ Multi-Signature Wallets</div>
                    <div>✓ Transaction Monitoring</div>
                    <div>✓ Fraud Detection Active</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'settings' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Platform Settings</h3>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Platform configuration and settings panel</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;