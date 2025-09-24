import React, { useState, useEffect } from 'react';
import { 
  MapPin, Navigation, Layers, Search, Filter,
  Verified, Clock, AlertTriangle, Maximize2,
  Star, Leaf, Award, Eye
} from 'lucide-react';

interface Farm {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  crops: string[];
  nftCount: number;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  image: string;
}

interface FarmLocatorProps {
  farms: Farm[];
  onFarmSelect: (farmId: string) => void;
}

const FarmLocator: React.FC<FarmLocatorProps> = ({ farms, onFarmSelect }) => {
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 }); // Center of USA
  const [zoomLevel, setZoomLevel] = useState(4);
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFarms = farms.filter(farm => {
    if (filterStatus !== 'all' && farm.verificationStatus !== filterStatus) return false;
    if (searchTerm && !farm.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !farm.location.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100 border-green-200';
      case 'pending': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <Verified className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handleFarmClick = (farm: Farm) => {
    setSelectedFarm(farm);
    setMapCenter(farm.coordinates);
    setZoomLevel(12);
    onFarmSelect(farm.id);
  };

  return (
    <div className="h-[600px] relative bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl overflow-hidden">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search farms or locations..."
            className="w-full pl-10 pr-4 py-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm font-medium"
        >
          <option value="all">All Farms ({farms.length})</option>
          <option value="verified">Verified ({farms.filter(f => f.verificationStatus === 'verified').length})</option>
          <option value="pending">Pending ({farms.filter(f => f.verificationStatus === 'pending').length})</option>
        </select>

        {/* Map Controls */}
        <div className="flex bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden">
          <button
            onClick={() => setZoomLevel(Math.min(zoomLevel + 1, 18))}
            className="px-3 py-2 hover:bg-gray-100 transition-colors text-sm font-medium"
          >
            +
          </button>
          <button
            onClick={() => setZoomLevel(Math.max(zoomLevel - 1, 1))}
            className="px-3 py-2 hover:bg-gray-100 transition-colors text-sm font-medium border-l border-gray-200"
          >
            -
          </button>
          <button className="px-3 py-2 hover:bg-gray-100 transition-colors border-l border-gray-200">
            <Layers className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Mock Interactive Map */}
      <div className="w-full h-full relative bg-gradient-to-br from-green-100 via-blue-100 to-amber-100">
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Farm Markers */}
        {filteredFarms.map((farm, index) => {
          const x = ((farm.coordinates.lng + 180) / 360) * 100;
          const y = ((90 - farm.coordinates.lat) / 180) * 100;
          
          return (
            <button
              key={farm.id}
              onClick={() => handleFarmClick(farm)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125 z-20 ${
                selectedFarm?.id === farm.id ? 'scale-125' : ''
              }`}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div className="relative">
                {/* Marker Pin */}
                <div className={`w-8 h-8 rounded-full shadow-lg border-2 border-white flex items-center justify-center ${
                  farm.verificationStatus === 'verified' 
                    ? 'bg-green-500' 
                    : farm.verificationStatus === 'pending'
                    ? 'bg-yellow-500'
                    : 'bg-gray-500'
                }`}>
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                
                {/* Pulse Animation */}
                <div className={`absolute inset-0 rounded-full animate-ping ${
                  farm.verificationStatus === 'verified' 
                    ? 'bg-green-400' 
                    : farm.verificationStatus === 'pending'
                    ? 'bg-yellow-400'
                    : 'bg-gray-400'
                } opacity-30`}></div>

                {/* NFT Count Badge */}
                <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                  {farm.nftCount}
                </div>
              </div>
            </button>
          );
        })}

        {/* Selected Farm Info Card */}
        {selectedFarm && (
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 p-6 z-30 max-w-md mx-auto">
            <div className="flex items-start space-x-4">
              <img
                src={selectedFarm.image}
                alt={selectedFarm.name}
                className="w-16 h-16 rounded-xl object-cover shadow-md"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-800 text-lg">{selectedFarm.name}</h3>
                  <button
                    onClick={() => setSelectedFarm(null)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                </div>
                
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{selectedFarm.location}</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedFarm.verificationStatus)}`}>
                    {getStatusIcon(selectedFarm.verificationStatus)}
                    <span className="capitalize">{selectedFarm.verificationStatus}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">{selectedFarm.nftCount}</span> NFTs available
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {selectedFarm.crops.slice(0, 3).map((crop, index) => (
                    <span 
                      key={crop}
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        index % 3 === 0 
                          ? 'bg-green-100 text-green-800' 
                          : index % 3 === 1
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {crop}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all text-sm flex items-center justify-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>View NFTs</span>
                  </button>
                  <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Navigation className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4 z-10 hidden sm:block">
          <h4 className="font-semibold text-gray-800 mb-3 text-sm">Farm Status</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Verified</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Unverified</span>
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4 z-10 hidden lg:block">
          <h4 className="font-semibold text-gray-800 mb-3 text-sm">Map Statistics</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Farms:</span>
              <span className="font-semibold text-gray-800">{farms.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Verified:</span>
              <span className="font-semibold text-green-600">{farms.filter(f => f.verificationStatus === 'verified').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total NFTs:</span>
              <span className="font-semibold text-purple-600">{farms.reduce((sum, f) => sum + f.nftCount, 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmLocator;