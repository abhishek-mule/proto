import React, { useState } from 'react';
import { 
  Plus, Upload, Camera, MapPin, Calendar, DollarSign,
  Sprout, Package, TrendingUp, Eye, Edit, Trash2,
  CheckCircle, Clock, AlertCircle, Star, Award,
  Zap, Coins, BarChart3, Users, Heart
} from 'lucide-react';
import CreateNFTModal from './CreateNFTModal';

const FarmerNFTDashboard: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  const stats = [
    { 
      label: 'Total NFTs Created', 
      value: '24', 
      change: '+3 this week',
      icon: Package, 
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50'
    },
    { 
      label: 'Total Revenue', 
      value: '$2,450', 
      change: '+18% this month',
      icon: DollarSign, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-50'
    },
    { 
      label: 'Active Listings', 
      value: '8', 
      change: '3 sold today',
      icon: TrendingUp, 
      color: 'from-amber-500 to-orange-600',
      bgColor: 'from-amber-50 to-orange-50'
    },
    { 
      label: 'Average Rating', 
      value: '4.8', 
      change: '127 reviews',
      icon: Star, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-50'
    },
  ];

  const nfts = [
    {
      id: '1',
      tokenId: '001',
      cropName: 'Organic Heirloom Tomatoes',
      image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'active',
      price: 45.50,
      views: 234,
      likes: 18,
      createdAt: '2024-01-15',
      stage: 'harvested',
      batchSize: '500kg'
    },
    {
      id: '2',
      tokenId: '002',
      cropName: 'Heritage Wheat Grain',
      image: 'https://images.pexels.com/photos/326059/pexels-photo-326059.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'sold',
      price: 28.75,
      views: 156,
      likes: 12,
      createdAt: '2024-01-10',
      stage: 'delivered',
      batchSize: '1000kg'
    },
    {
      id: '3',
      tokenId: '003',
      cropName: 'Hydroponic Lettuce Mix',
      image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'pending',
      price: 18.90,
      views: 89,
      likes: 7,
      createdAt: '2024-01-20',
      stage: 'growing',
      batchSize: '200kg'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'sold': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'sold': return <Package className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'nfts', label: 'My NFTs', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'earnings', label: 'Earnings', icon: Coins }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-yellow-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
                NFT Farm Dashboard
              </h1>
              <p className="text-xl text-green-100 font-medium">
                Create, manage, and track your agricultural NFTs
              </p>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center space-x-3 group"
            >
              <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                <Plus className="h-6 w-6" />
              </div>
              <span>Create New NFT</span>
              <Zap className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`bg-gradient-to-br ${stat.bgColor} rounded-3xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.change}</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-700">{stat.label}</h3>
              </div>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-3xl shadow-xl border border-amber-100/50 mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto scrollbar-hide">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex-shrink-0 py-4 px-6 text-sm font-medium transition-all flex items-center space-x-2 ${
                      selectedTab === tab.id
                        ? 'text-green-600 border-b-2 border-green-500 bg-green-50'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {selectedTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Quick Actions */}
                  <div className="lg:col-span-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-3"
                      >
                        <Plus className="h-5 w-5" />
                        <span>Create New NFT</span>
                      </button>
                      <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-3">
                        <Upload className="h-5 w-5" />
                        <span>Bulk Upload</span>
                      </button>
                      <button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 rounded-2xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-3">
                        <BarChart3 className="h-5 w-5" />
                        <span>View Analytics</span>
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Recent NFTs</h3>
                    <div className="space-y-4">
                      {nfts.slice(0, 3).map(nft => (
                        <div key={nft.id} className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                          <div className="flex items-center space-x-4">
                            <img
                              src={nft.image}
                              alt={nft.cropName}
                              className="w-16 h-16 rounded-xl object-cover shadow-md"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-gray-800">{nft.cropName}</h4>
                                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(nft.status)}`}>
                                  {getStatusIcon(nft.status)}
                                  <span className="capitalize">{nft.status}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>Token #{nft.tokenId}</span>
                                <span className="font-semibold text-gray-800">${nft.price}</span>
                              </div>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Eye className="h-3 w-3" />
                                  <span>{nft.views}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Heart className="h-3 w-3" />
                                  <span>{nft.likes}</span>
                                </div>
                                <span>{nft.batchSize}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'nfts' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">My NFT Collection</h3>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create NFT</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nfts.map(nft => (
                    <div key={nft.id} className="bg-white rounded-3xl shadow-lg border border-amber-100/50 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={nft.image}
                          alt={nft.cropName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                            #{nft.tokenId}
                          </div>
                        </div>
                        <div className="absolute top-4 right-4">
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusColor(nft.status)}`}>
                            {getStatusIcon(nft.status)}
                            <span className="capitalize">{nft.status}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-gray-800 text-lg leading-tight">{nft.cropName}</h4>
                            <p className="text-sm text-gray-600 mt-1">Batch: {nft.batchSize}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-900">${nft.price}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>{nft.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="h-4 w-4" />
                              <span>{nft.likes}</span>
                            </div>
                          </div>
                          <span>{new Date(nft.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="flex space-x-2">
                          <button className="flex-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 py-2 px-4 rounded-xl font-medium hover:from-blue-200 hover:to-indigo-200 transition-all flex items-center justify-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </button>
                          <button className="flex-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 py-2 px-4 rounded-xl font-medium hover:from-amber-200 hover:to-orange-200 transition-all flex items-center justify-center space-x-1">
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          <button className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800">Performance Analytics</h3>
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 text-center border border-blue-200">
                  <BarChart3 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Detailed analytics dashboard coming soon</p>
                </div>
              </div>
            )}

            {selectedTab === 'earnings' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800">Earnings Overview</h3>
                <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-2xl p-8 text-center border border-green-200">
                  <Coins className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Earnings tracking and payouts dashboard</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create NFT Modal */}
      {showCreateModal && (
        <CreateNFTModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default FarmerNFTDashboard;