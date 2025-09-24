import React, { useState, useEffect } from 'react';
import { 
  MapPin, Navigation, Layers, Search, Filter,
  Verified, Clock, AlertTriangle, Maximize2,
  Star, Leaf, Award, Eye, Sprout, Package,
  Zap, Shield, Users, TrendingUp
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
  rating: number;
  totalSales: number;
  farmSize: string;
  certifications: string[];
}

interface OpenStreetMapProps {
  farms: Farm[];
  onFarmSelect: (farmId: string) => void;
  selectedFarmId?: string;
  className?: string;
}

const OpenStreetMap: React.FC<OpenStreetMapProps> = ({ 
  farms, 
  onFarmSelect, 
  selectedFarmId,
  className = '' 
}) => {
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 }); // Center of USA
  const [zoomLevel, setZoomLevel] = useState(4);
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite' | 'terrain'>('standard');

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

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500 border-green-600 shadow-green-500/50';
      case 'pending': return 'bg-yellow-500 border-yellow-600 shadow-yellow-500/50';
      default: return 'bg-gray-500 border-gray-600 shadow-gray-500/50';
    }
  };

  const handleFarmClick = (farm: Farm) => {
    setSelectedFarm(farm);
    setMapCenter(farm.coordinates);
    setZoomLevel(12);
    onFarmSelect(farm.id);
  };

  const getMapBackground = () => {
    switch (mapStyle) {
      case 'satellite':
        return 'from-blue-200 via-green-200 to-brown-200';
      case 'terrain':
        return 'from-green-200 via-brown-200 to-gray-200';
      default:
        return 'from-green-100 via-blue-100 to-amber-100';
    }
  };

  useEffect(() => {
    if (selectedFarmId) {
      const farm = farms.find(f => f.id === selectedFarmId);
      if (farm) {
        handleFarmClick(farm);
      }
    }
  }, [selectedFarmId, farms]);

  return (
    <div className={`bg-white rounded-3xl shadow-2xl border border-amber-100/50 overflow-hidden ${className}`}>
      {/* Map Controls Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search farms or locations..."
              className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70 text-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-white/50 text-white text-sm font-medium"
            >
              <option value="all" className="text-gray-800">All Farms ({farms.length})</option>
              <option value="verified" className="text-gray-800">Verified ({farms.filter(f => f.verificationStatus === 'verified').length})</option>
              <option value="pending" className="text-gray-800">Pending ({farms.filter(f => f.verificationStatus === 'pending').length})</option>
            </select>

            <select
              value={mapStyle}
              onChange={(e) => setMapStyle(e.target.value as any)}
              className="px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-white/50 text-white text-sm font-medium"
            >
              <option value="standard" className="text-gray-800">Standard</option>
              <option value="satellite" className="text-gray-800">Satellite</option>
              <option value="terrain" className="text-gray-800">Terrain</option>
            </select>

            {/* Map Controls */}
            <div className="flex bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 overflow-hidden">
              <button
                onClick={() => setZoomLevel(Math.min(zoomLevel + 1, 18))}
                className="px-3 py-2 hover:bg-white/20 transition-colors text-sm font-medium"
              >
                +
              </button>
              <button
                onClick={() => setZoomLevel(Math.max(zoomLevel - 1, 1))}
                className="px-3 py-2 hover:bg-white/20 transition-colors text-sm font-medium border-l border-white/30"
              >
                -
              </button>
              <button className="px-3 py-2 hover:bg-white/20 transition-colors border-l border-white/30">
                <Layers className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="relative h-96 lg:h-[500px]">
        {/* Map Background */}
        <div className={`w-full h-full bg-gradient-to-br ${getMapBackground()} relative overflow-hidden`}>
          {/* Grid Pattern for Map Feel */}
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
            // Convert coordinates to percentage positions
            const x = ((farm.coordinates.lng + 180) / 360) * 100;
            const y = ((90 - farm.coordinates.lat) / 180) * 100;
            const isSelected = selectedFarm?.id === farm.id;
            
            return (
              <button
                key={farm.id}
                onClick={() => handleFarmClick(farm)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125 z-20 group ${
                  isSelected ? 'scale-125 z-30' : ''
                }`}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div className="relative">
                  {/* Marker Pin */}
                  <div className={`w-10 h-10 rounded-full shadow-2xl border-3 border-white flex items-center justify-center ${getMarkerColor(farm.verificationStatus)} group-hover:shadow-2xl transition-all duration-300`}>
                    <Sprout className="h-5 w-5 text-white" />
                  </div>
                  
                  {/* Pulse Animation */}
                  <div className={`absolute inset-0 rounded-full animate-ping opacity-30 ${
                    farm.verificationStatus === 'verified' 
                      ? 'bg-green-400' 
                      : farm.verificationStatus === 'pending'
                      ? 'bg-yellow-400'
                      : 'bg-gray-400'
                  }`}></div>

                  {/* NFT Count Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg border-2 border-white">
                    {farm.nftCount}
                  </div>

                  {/* Hover Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-gray-900/95 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap shadow-xl">
                      {farm.name}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/95"></div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Selected Farm Info Card */}
          {selectedFarm && (
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-6 z-30 max-w-md mx-auto animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-start space-x-4">
                <img
                  src={selectedFarm.image}
                  alt={selectedFarm.name}
                  className="w-20 h-20 rounded-2xl object-cover shadow-lg"
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
                    <span className="text-sm text-gray-600 font-medium">{selectedFarm.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedFarm.verificationStatus)}`}>
                      {getStatusIcon(selectedFarm.verificationStatus)}
                      <span className="capitalize">{selectedFarm.verificationStatus}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Package className="h-3 w-3" />
                        <span className="font-semibold">{selectedFarm.nftCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold">{selectedFarm.rating}</span>
                      </div>
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
                    {selectedFarm.crops.length > 3 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                        +{selectedFarm.crops.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all hover:scale-105 shadow-lg flex items-center justify-center space-x-1 text-sm">
                      <Eye className="h-4 w-4" />
                      <span>View NFTs</span>
                    </button>
                    <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                      <Navigation className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Map Legend */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-4 z-10">
            <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Farm Status</span>
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
                <span className="text-xs text-gray-700 font-medium">Verified ({farms.filter(f => f.verificationStatus === 'verified').length})</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-lg"></div>
                <span className="text-xs text-gray-700 font-medium">Pending ({farms.filter(f => f.verificationStatus === 'pending').length})</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-500 rounded-full shadow-lg"></div>
                <span className="text-xs text-gray-700 font-medium">Unverified ({farms.filter(f => f.verificationStatus === 'unverified').length})</span>
              </div>
            </div>
          </div>

          {/* Map Stats Panel */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-4 z-10 hidden lg:block">
            <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <span>Map Statistics</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Farms:</span>
                <span className="font-bold text-gray-800">{farms.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active NFTs:</span>
                <span className="font-bold text-purple-600">{farms.reduce((sum, f) => sum + f.nftCount, 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg Rating:</span>
                <span className="font-bold text-yellow-600">
                  {(farms.reduce((sum, f) => sum + f.rating, 0) / farms.length).toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Sales:</span>
                <span className="font-bold text-green-600">
                  {farms.reduce((sum, f) => sum + f.totalSales, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Zoom Level Indicator */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 px-3 py-2 z-10">
            <div className="flex items-center space-x-2 text-sm">
              <Maximize2 className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-800">Zoom: {zoomLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Farm List (Mobile) */}
      <div className="lg:hidden border-t border-gray-200 max-h-48 overflow-y-auto">
        <div className="p-4 space-y-3">
          <h4 className="font-bold text-gray-800 text-sm">Farms in View</h4>
          {filteredFarms.slice(0, 5).map(farm => (
            <button
              key={farm.id}
              onClick={() => handleFarmClick(farm)}
              className={`w-full text-left p-3 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                selectedFarm?.id === farm.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={farm.image}
                  alt={farm.name}
                  className="w-12 h-12 rounded-lg object-cover shadow-md"
                />
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-800 text-sm">{farm.name}</h5>
                  <p className="text-xs text-gray-600">{farm.location}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(farm.verificationStatus)}`}>
                      {getStatusIcon(farm.verificationStatus)}
                      <span>{farm.verificationStatus}</span>
                    </div>
                    <span className="text-xs text-gray-500">{farm.nftCount} NFTs</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OpenStreetMap;