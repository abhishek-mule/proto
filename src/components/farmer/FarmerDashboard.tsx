import React, { useState, useEffect } from 'react';
import { Wallet, Plus, MessageCircle, TrendingUp } from 'lucide-react';
import farmerService from '../../services/farmerService'; // Use default import for farmerService

// Define types for props
type AddCropFormProps = {
  onClose: () => void;
};

type AIAssistantProps = {
  onClose: () => void;
};

// Define types for data
type Stat = {
  label: string;
  value: string;
  icon: React.ElementType; // Replace `any` with a more specific type
  color: 'green' | 'blue' | 'amber' | 'purple'; // Use a union type for colors
};

type Crop = {
  id: number;
  name: string;
  price: string;
  status: string;
  progress: number;
  image: string;
};

type User = {
  name: string;
  walletBalance: string;
};

// Mock components - replace with actual imports
const AddCropForm: React.FC<AddCropFormProps> = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
      <h3 className="text-xl font-bold mb-4">Add New Crop</h3>
      <p className="text-gray-600 mb-4">Add crop form would go here...</p>
      <button
        onClick={onClose}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Close
      </button>
    </div>
  </div>
);

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
      <h3 className="text-xl font-bold mb-4">AI Farm Assistant</h3>
      <p className="text-gray-600 mb-4">AI assistant interface would go here...</p>
      <button
        onClick={onClose}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Close
      </button>
    </div>
  </div>
);

const FarmerDashboard = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    const loadFarmerData = async () => {
      try {
        const data = await farmerService.getFarmerData(); // Use the farmerService
        setUser(data.user);
        setStats(data.stats);
        setCrops(data.crops);
      } catch {
        setErrorMessage('Failed to load farmer data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadFarmerData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 space-y-6 md:space-y-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-green-50/50 rounded-2xl md:rounded-3xl shadow-xl border border-gray-100/50 p-6 md:p-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Farmer Dashboard
            </h1>
            <p className="text-gray-600 text-base md:text-lg font-medium">
              Welcome back, {user?.name}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 md:p-6 flex items-center space-x-3 md:space-x-4 shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <Wallet className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-semibold text-green-800">Wallet Balance</p>
                <p className="text-xl md:text-2xl font-bold text-green-900">{user?.walletBalance} ETH</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddCrop(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2 md:space-x-3 text-sm md:text-base"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Crop</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors = {
            green: 'from-green-500 to-green-600',
            blue: 'from-blue-500 to-blue-600',
            amber: 'from-amber-500 to-amber-600',
            purple: 'from-purple-500 to-purple-600',
          };
          return (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100/50 p-8 hover:scale-105 transition-transform duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${colors[stat.color]} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Crop Listings */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100/50 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">My Crops</h2>
              <div className="flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-full">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-600 font-semibold">All performing well</span>
              </div>
            </div>

            <div className="space-y-6">
              {crops.map((crop) => (
                <div key={crop.id} className="border-2 border-gray-100 rounded-2xl p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                  <div className="flex items-center space-x-6">
                    <img
                      src={crop.image}
                      alt={crop.name}
                      className="w-20 h-20 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-800 text-lg">{crop.name}</h3>
                        <span className="text-xl font-bold text-green-600">{crop.price}</span>
                      </div>
                      <div className="flex items-center space-x-6">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          crop.status === 'Growing' ? 'bg-yellow-100 text-yellow-800' :
                          crop.status === 'Harvested' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {crop.status}
                        </span>
                        <div className="flex-1">
                          <div className="bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${crop.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-600 font-semibold">{crop.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Assistant */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-xl border border-blue-100/50 p-8 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">AI Farm Assistant</h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Get instant advice on crop management, weather insights, and market trends.
            </p>
            <button
              onClick={() => setShowAI(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Conversation
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100/50 p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">This Week</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Orders Fulfilled</span>
                <span className="font-bold text-gray-800 text-lg">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Revenue Growth</span>
                <span className="font-bold text-green-600 text-lg">+18%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">New Customers</span>
                <span className="font-bold text-blue-600 text-lg">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddCrop && (
        <AddCropForm onClose={() => setShowAddCrop(false)} />
      )}

      {showAI && (
        <AIAssistant onClose={() => setShowAI(false)} />
      )}
    </div>
  );
};

export default FarmerDashboard;