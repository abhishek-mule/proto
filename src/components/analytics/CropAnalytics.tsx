import React, { useState } from 'react';
import { 
  Star, TrendingUp, Users, Package, Calendar,
  BarChart3, PieChart, Activity, Award, Leaf,
  MapPin, Clock, Shield, Heart, Eye
} from 'lucide-react';

interface CropAnalyticsProps {
  cropData: {
    id: string;
    name: string;
    rating: number;
    reviews: number;
    totalSales: number;
    viewCount: number;
    likeCount: number;
    supplyChainStage: string;
    verificationStatus: string;
    location: string;
    harvestDate: string;
  };
  className?: string;
}

const CropAnalytics: React.FC<CropAnalyticsProps> = ({ cropData, className = '' }) => {
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const metrics = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'engagement', label: 'Engagement', icon: Heart },
    { id: 'supply', label: 'Supply Chain', icon: Package },
    { id: 'quality', label: 'Quality', icon: Award }
  ];

  const getStageProgress = (stage: string) => {
    const stages = {
      planted: 16,
      growing: 33,
      harvested: 50,
      processed: 66,
      shipped: 83,
      delivered: 100
    };
    return stages[stage as keyof typeof stages] || 0;
  };

  const getStageColor = (stage: string) => {
    const colors = {
      planted: 'from-blue-500 to-blue-600',
      growing: 'from-yellow-500 to-amber-600',
      harvested: 'from-green-500 to-green-600',
      processed: 'from-purple-500 to-purple-600',
      shipped: 'from-orange-500 to-red-600',
      delivered: 'from-emerald-500 to-teal-600'
    };
    return colors[stage as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Star className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">{cropData.rating}</div>
              <div className="text-sm text-blue-700">Rating</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <Package className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">{cropData.totalSales}</div>
              <div className="text-sm text-green-700">Sales</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Eye className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">{cropData.viewCount}</div>
              <div className="text-sm text-purple-700">Views</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-4 border border-amber-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-600 rounded-lg">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-900">{cropData.likeCount}</div>
              <div className="text-sm text-amber-700">Likes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-4">Customer Reviews</h4>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map(rating => {
            const percentage = rating === 5 ? 75 : rating === 4 ? 20 : rating === 3 ? 3 : rating === 2 ? 1 : 1;
            return (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-12">
                  <span className="text-sm font-medium text-gray-700">{rating}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderEngagement = () => (
    <div className="space-y-6">
      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-pink-50 to-rose-100 rounded-2xl p-6 border border-pink-200">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="h-6 w-6 text-pink-600" />
            <h4 className="font-bold text-pink-800">Engagement Rate</h4>
          </div>
          <div className="text-3xl font-bold text-pink-900 mb-2">8.5%</div>
          <div className="text-sm text-pink-700">Above average for organic crops</div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <Eye className="h-6 w-6 text-blue-600" />
            <h4 className="font-bold text-blue-800">View Duration</h4>
          </div>
          <div className="text-3xl font-bold text-blue-900 mb-2">2.3m</div>
          <div className="text-sm text-blue-700">Average time spent viewing</div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-6 w-6 text-green-600" />
            <h4 className="font-bold text-green-800">Return Customers</h4>
          </div>
          <div className="text-3xl font-bold text-green-900 mb-2">67%</div>
          <div className="text-sm text-green-700">Customer retention rate</div>
        </div>
      </div>

      {/* Engagement Timeline */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
        <h4 className="font-bold text-gray-800 mb-4">Engagement Over Time</h4>
        <div className="h-32 bg-gradient-to-r from-gray-100 to-blue-100 rounded-xl flex items-end justify-center p-4">
          <div className="flex items-end space-x-2 h-full">
            {[40, 65, 45, 80, 70, 90, 85].map((height, index) => (
              <div
                key={index}
                className="bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg w-8 transition-all duration-1000 hover:from-green-600 hover:to-green-500"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupplyChain = () => (
    <div className="space-y-6">
      {/* Supply Chain Progress */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-green-800">Supply Chain Progress</h4>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
            cropData.supplyChainStage === 'delivered' 
              ? 'bg-green-100 text-green-800 border-green-200'
              : 'bg-yellow-100 text-yellow-800 border-yellow-200'
          }`}>
            {cropData.supplyChainStage.charAt(0).toUpperCase() + cropData.supplyChainStage.slice(1)}
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-700">Progress:</span>
            <span className="font-bold text-green-800">{getStageProgress(cropData.supplyChainStage)}%</span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-3">
            <div 
              className={`bg-gradient-to-r ${getStageColor(cropData.supplyChainStage)} h-3 rounded-full transition-all duration-1000`}
              style={{ width: `${getStageProgress(cropData.supplyChainStage)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Stage Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-lg">
          <div className="flex items-center space-x-2 mb-3">
            <MapPin className="h-4 w-4 text-gray-600" />
            <span className="font-semibold text-gray-800">Current Location</span>
          </div>
          <p className="text-gray-700">{cropData.location}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span className="font-semibold text-gray-800">Harvest Date</span>
          </div>
          <p className="text-gray-700">{new Date(cropData.harvestDate).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );

  const renderQuality = () => (
    <div className="space-y-6">
      {/* Quality Score */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-amber-800">Quality Score</h4>
          <div className="flex items-center space-x-1">
            <Award className="h-5 w-5 text-amber-600" />
            <span className="text-2xl font-bold text-amber-900">A+</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-amber-700">Freshness:</span>
            <span className="font-bold text-amber-900">95%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-amber-700">Nutrition:</span>
            <span className="font-bold text-amber-900">92%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-amber-700">Appearance:</span>
            <span className="font-bold text-amber-900">98%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-amber-700">Taste:</span>
            <span className="font-bold text-amber-900">96%</span>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-5 w-5 text-green-600" />
          <h4 className="font-bold text-green-800">Certifications & Standards</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {['USDA Organic', 'Non-GMO', 'Fair Trade', 'Pesticide-Free'].map((cert, index) => (
            <div key={cert} className="flex items-center space-x-2 bg-white/60 rounded-lg p-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">{cert}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-3xl shadow-xl border border-amber-100/50 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">{cropData.name} Analytics</h3>
            <p className="text-amber-100 text-sm">Performance insights and metrics</p>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
            <Activity className="h-4 w-4" />
            <span className="text-sm font-medium">Live Data</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto scrollbar-hide">
          {metrics.map(metric => {
            const Icon = metric.icon;
            return (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={`flex-shrink-0 py-3 px-4 text-sm font-medium transition-all flex items-center space-x-2 ${
                  selectedMetric === metric.id
                    ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{metric.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <div className="animate-in fade-in-50 duration-200">
          {selectedMetric === 'overview' && renderOverview()}
          {selectedMetric === 'engagement' && renderEngagement()}
          {selectedMetric === 'supply' && renderSupplyChain()}
          {selectedMetric === 'quality' && renderQuality()}
        </div>
      </div>
    </div>
  );
};

export default CropAnalytics;