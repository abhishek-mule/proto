import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, TrendingUp, Award, MapPin, 
  Leaf, Shield, Star, Eye, ShoppingCart, 
  ChevronRight, Sparkles, Globe, Users,
  ArrowRight, Play, Zap, Heart
} from 'lucide-react';
import NFTCard from './nft/NFTCard';
import { useAuth } from '../contexts/AuthContext';

interface NFTCardProps {
  nft: {
    id: string;
    tokenId: string;
    cropName: string;
    cropImage: string;
    farmerName: string;
    farmLocation: string;
    harvestDate: string;
    price: number;
    priceChange: number;
    rating: number;
    reviews: number;
    verificationStatus: 'verified' | 'pending' | 'unverified';
    certifications: string[];
    supplyChainStage: 'planted' | 'growing' | 'harvested' | 'processed' | 'shipped' | 'delivered';
    coordinates: { lat: number; lng: number };
    batchSize: string;
    organicCertified: boolean;
  };
  onViewDetails: (nftId: string) => void;
  onPurchase: (nftId: string) => void;
}

const PWAHome: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isVisible, setIsVisible] = useState(false);

  // Animation trigger
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Enhanced mock data with more variety
  const mockNFTs = [
    {
      id: '1',
      tokenId: 'AGR-001',
      cropName: 'Organic Heirloom Tomatoes',
      cropImage: '/images/tomato.jpg',
      farmerName: 'Maria Rodriguez',
      farmLocation: 'Sonoma Valley, CA',
      harvestDate: '2025-09-27',
      price: 45.50,
      priceChange: 8.2,
      rating: 4.9,
      reviews: 234,
      verificationStatus: 'verified' as const,
      certifications: ['USDA Organic', 'Biodynamic', 'Non-GMO'],
      supplyChainStage: 'delivered' as const,
      coordinates: { lat: 38.2975, lng: -122.4584 },
      batchSize: '500kg',
      organicCertified: true,
    },
    {
      id: '2',
      tokenId: 'AGR-002',
      cropName: 'Heritage Wheat',
      cropImage: '/images/wheat.jpg',
      farmerName: 'James Mitchell',
      farmLocation: 'Kansas Plains, KS',
      harvestDate: '2025-09-20',
      price: 32.80,
      priceChange: -2.1,
      rating: 4.7,
      reviews: 187,
      verificationStatus: 'verified' as const,
      certifications: ['Non-GMO', 'Rainforest Alliance'],
      supplyChainStage: 'harvested' as const,
      coordinates: { lat: 39.0473, lng: -95.6890 },
      batchSize: '1200kg',
      organicCertified: false,
    },
    {
      id: '3',
      tokenId: 'AGR-003',
      cropName: 'Sweet Corn Varieties',
      cropImage: '/images/corn.jpg',
      farmerName: 'Sarah Chen',
      farmLocation: 'Cedar Rapids, IA',
      harvestDate: '2025-09-25',
      price: 28.00,
      priceChange: 5.7,
      rating: 4.5,
      reviews: 156,
      verificationStatus: 'pending' as const,
      certifications: ['Local Grown', 'Pesticide-Free'],
      supplyChainStage: 'growing' as const,
      coordinates: { lat: 41.9779, lng: -91.6656 },
      batchSize: '800kg',
      organicCertified: true,
    },
    {
      id: '4',
      tokenId: 'AGR-004',
      cropName: 'Artisan Coffee Beans',
      cropImage: '/images/coffee.jpg',
      farmerName: 'Carlos Mendoza',
      farmLocation: 'Blue Mountains, Jamaica',
      harvestDate: '2025-08-15',
      price: 89.99,
      priceChange: 12.5,
      rating: 4.8,
      reviews: 342,
      verificationStatus: 'verified' as const,
      certifications: ['Fair Trade', 'Shade Grown', 'Bird Friendly'],
      supplyChainStage: 'processed' as const,
      coordinates: { lat: 18.0154, lng: -76.8013 },
      batchSize: '300kg',
      organicCertified: true,
    }
  ];

  const stats = [
    { label: 'Active Farmers', value: '12,543', icon: Users, color: 'text-blue-600' },
    { label: 'NFTs Minted', value: '45,892', icon: Zap, color: 'text-purple-600' },
    { label: 'Countries', value: '67', icon: Globe, color: 'text-green-600' },
    { label: 'Verified Crops', value: '98.7%', icon: Shield, color: 'text-amber-600' }
  ];

  const features = [
    {
      title: 'Full Traceability',
      description: 'Track your food from seed to table with blockchain verification',
      icon: MapPin,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Verified Organic',
      description: 'Certified organic produce with tamper-proof documentation',
      icon: Leaf,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Fair Pricing',
      description: 'Direct farmer-to-consumer pricing with transparent value distribution',
      icon: TrendingUp,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Quality Assured',
      description: 'Premium quality crops with community ratings and reviews',
      icon: Award,
      gradient: 'from-amber-500 to-orange-500'
    }
  ];

  const filteredNFTs = mockNFTs.filter(nft => {
    const matchesSearch = nft.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nft.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nft.farmLocation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'organic' && nft.organicCertified) ||
                         (selectedFilter === 'verified' && nft.verificationStatus === 'verified') ||
                         (selectedFilter === 'trending' && nft.priceChange > 0);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-transparent"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-yellow-300/20 rounded-full blur-lg animate-bounce"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span className="text-white/90 text-sm font-medium">Revolutionizing Agriculture</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Farm to Fork
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                NFT Marketplace
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover sustainable agriculture through blockchain-verified crops. 
              Connect directly with farmers and trace your food's journey.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/marketplace"
                className="group relative px-8 py-4 bg-white text-green-600 font-bold rounded-2xl hover:bg-green-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <span className="flex items-center">
                  Explore Marketplace
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <button className="group flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium text-sm">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Featured Agriculture NFTs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover premium crops from verified farmers around the world
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search crops, farmers, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 text-gray-900"
            >
              <option value="all">All Crops</option>
              <option value="organic">Organic Only</option>
              <option value="verified">Verified Only</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredNFTs.map((nft, index) => (
            <div
              key={nft.id}
              className={`transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <NFTCard 
                nft={nft} 
                onViewDetails={(id) => console.log('View details:', id)}
                onPurchase={(id) => console.log('Purchase:', id)}
              />
            </div>
          ))}
        </div>

        {filteredNFTs.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No crops found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the future of sustainable agriculture with blockchain technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 border border-gray-100 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
              Ready to Join the Revolution?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Connect with sustainable farmers, discover premium crops, and be part of the blockchain agriculture movement.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="group px-8 py-4 bg-white text-green-600 font-bold rounded-2xl hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <span className="flex items-center">
                      Get Started
                      <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                  <Link
                    to="/learn-more"
                    className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300"
                  >
                    Learn More
                  </Link>
                </>
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {user.role === 'farmer' && (
                    <Link
                      to="/farmer"
                      className="group px-8 py-4 bg-white text-green-600 font-bold rounded-2xl hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <span className="flex items-center">
                        <Leaf className="mr-2 h-5 w-5" />
                        Farmer Dashboard
                        <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="group px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <span className="flex items-center">
                        <Shield className="mr-2 h-5 w-5" />
                        Admin Dashboard
                        <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  )}
                  <Link
                    to="/marketplace"
                    className="group px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <span className="flex items-center">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Marketplace
                      <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Get the latest updates on new crops, farmers, and marketplace features.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
              <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAHome;