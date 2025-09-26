import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, TrendingUp, Grid, List, Map, BarChart3 } from 'lucide-react';
import NFTCard from './NFTCard';
import OpenStreetMap from '../maps/OpenStreetMap';
import PaymentModal from '../payments/PaymentModal';
import PriceOracle from '../analytics/PriceOracle';
import CropAnalytics from '../analytics/CropAnalytics';
import * as nftService from '../../services/nftService';
import { NFT } from '../../types/nft';

const NFTMarketplace: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    const fetchNfts = async () => {
      try {
        setLoading(true);
        const data = await nftService.getAllNfts();
        setNfts(data.nfts);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch NFTs.');
        // Fallback to mock data if API fails
        setNfts([
          {
            id: '1',
            tokenId: '001',
            cropName: 'Organic Heirloom Tomatoes',
            cropImage: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=600',
            farmerName: 'John Smith Farm',
            farmLocation: 'Sonoma County, CA',
            harvestDate: '2024-01-15',
            price: 45.50,
            priceChange: 12.5,
            rating: 4.9,
            reviews: 127,
            views: 234,
            likes: 18,
            status: 'active',
            verificationStatus: 'verified',
            certifications: ['USDA Organic', 'Non-GMO', 'Fair Trade'],
            supplyChainStage: 'harvested',
            coordinates: { lat: 38.2975, lng: -122.4581 },
            batchSize: '500kg',
            organicCertified: true,
            category: 'Vegetable',
            createdAt: '2024-01-15'
          },
          {
            id: '2',
            tokenId: '002',
            cropName: 'Heritage Wheat Grain',
            cropImage: 'https://images.pexels.com/photos/326059/pexels-photo-326059.jpeg?auto=compress&cs=tinysrgb&w=600',
            farmerName: 'Prairie Gold Farm',
            farmLocation: 'Kansas, USA',
            harvestDate: '2024-01-10',
            price: 28.75,
            priceChange: -3.2,
            rating: 4.7,
            reviews: 89,
            views: 156,
            likes: 12,
            status: 'active',
            verificationStatus: 'verified',
            certifications: ['Heritage Variety', 'Sustainable'],
            supplyChainStage: 'processed',
            coordinates: { lat: 39.0119, lng: -98.4842 },
            batchSize: '1000kg',
            organicCertified: false,
            category: 'Grain',
            createdAt: '2024-01-10'
          },
          {
            id: '3',
            tokenId: '003',
            cropName: 'Hydroponic Lettuce Mix',
            cropImage: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=600',
            farmerName: 'Urban Greens',
            farmLocation: 'Brooklyn, NY',
            harvestDate: '2024-01-20',
            price: 18.90,
            priceChange: 8.7,
            rating: 4.6,
            reviews: 73,
            views: 89,
            likes: 7,
            status: 'active',
            verificationStatus: 'pending',
            certifications: ['Hydroponic', 'Local'],
            supplyChainStage: 'growing',
            coordinates: { lat: 40.6782, lng: -73.9442 },
            batchSize: '200kg',
            organicCertified: false,
            category: 'Vegetable',
            createdAt: '2024-01-20'
          },
          {
            id: '4',
            tokenId: '004',
            cropName: 'Free-Range Carrots',
            cropImage: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=600',
            farmerName: 'Green Valley Co-op',
            farmLocation: 'Oregon, USA',
            harvestDate: '2024-01-12',
            price: 32.40,
            priceChange: 15.3,
            rating: 4.8,
            reviews: 156,
            views: 201,
            likes: 25,
            status: 'active',
            verificationStatus: 'verified',
            certifications: ['USDA Organic', 'Biodynamic'],
            supplyChainStage: 'shipped',
            coordinates: { lat: 44.9778, lng: -123.0351 },
            batchSize: '750kg',
            organicCertified: true,
            category: 'Vegetable',
            createdAt: '2024-01-12'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNfts();
  }, []);

  // Convert NFTs to farms for map
  const farms = nfts.map(nft => ({
    id: nft.id,
    name: nft.farmerName,
    location: nft.farmLocation,
    coordinates: nft.coordinates,
    crops: [nft.cropName],
    nftCount: 1,
    verificationStatus: nft.verificationStatus,
    image: nft.cropImage,
    rating: nft.rating,
    totalSales: Math.floor(Math.random() * 50) + 10,
    farmSize: '25 acres',
    certifications: nft.certifications
  }));

  const categories = [
    { id: 'all', name: 'All Crops', count: nfts.length },
    { id: 'vegetables', name: 'Vegetables', count: nfts.filter(n => n.category === 'Vegetable').length },
    { id: 'grains', name: 'Grains', count: nfts.filter(n => n.category === 'Grain').length },
    { id: 'organic', name: 'Organic Only', count: nfts.filter(n => n.organicCertified).length }
  ];

  const handleViewDetails = (nftId: string) => {
    console.log('View details for NFT:', nftId);
    // Navigate to NFT details page
  };

  const handlePurchase = (nftId: string) => {
    setSelectedNFT(nftId);
    setShowPayment(true);
  };

  const handlePaymentComplete = (paymentData: any) => {
    console.log('Payment completed:', paymentData);
    setShowPayment(false);
    setSelectedNFT(null);
  };

  const filteredNFTs = nfts.filter(nft => {
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'organic' && !nft.organicCertified) return false;
      if (selectedCategory === 'vegetables' && nft.category !== 'Vegetable') return false;
      if (selectedCategory === 'grains' && nft.category !== 'Grain') return false;
    }
    if (searchTerm && !nft.cropName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-yellow-50 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Agricultural NFT Marketplace
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover, verify, and own unique crop NFTs with complete blockchain traceability from farm to table
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-base md:text-lg">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <MapPin className="h-5 w-5" />
              <span>GPS Verified Farms</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <TrendingUp className="h-5 w-5" />
              <span>Real-time Pricing</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <Filter className="h-5 w-5" />
              <span>AI-Powered Stories</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Analytics Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <BarChart3 className="h-5 w-5" />
            <span>{showAnalytics ? 'Hide' : 'Show'} Analytics</span>
          </button>
        </div>

        {/* Analytics Panels */}
        {showAnalytics && (
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <PriceOracle cropType="tomatoes" />
            <CropAnalytics 
              cropData={{
                id: '1',
                name: 'Organic Heirloom Tomatoes',
                rating: 4.9,
                reviews: 127,
                totalSales: 45,
                viewCount: 234,
                likeCount: 18,
                supplyChainStage: 'harvested',
                verificationStatus: 'verified',
                location: 'Sonoma County, CA',
                harvestDate: '2024-01-15'
              }}
            />
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl border border-amber-100/50 p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for crops, farmers, or locations..."
                className="w-full pl-12 pr-6 py-3 md:py-4 border-2 border-gray-200 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-base md:text-lg placeholder-gray-400"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-base font-medium"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-base font-medium"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-2xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white text-green-600 shadow-md' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-green-600 shadow-md' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'map' 
                    ? 'bg-white text-green-600 shadow-md' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Map className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading && <p>Loading NFTs...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && viewMode === 'map' ? (
          <div className="space-y-6">
            <OpenStreetMap 
              farms={farms.filter(farm => 
                filteredNFTs.some(nft => nft.farmerName === farm.name)
              )}
              onFarmSelect={(farmId) => {
                console.log('Selected farm:', farmId);
                // Could navigate to farm details or filter NFTs
              }}
            />
          </div>
        ) : !loading && !error && (
          <div className={`mb-8 ${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8' 
              : 'space-y-6'
          }`}>
            {filteredNFTs.map(nft => (
              <NFTCard
                key={nft.id}
                nft={nft}
                onViewDetails={handleViewDetails}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && !error && viewMode !== 'map' && filteredNFTs.length > 0 && (
          <div className="text-center">
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base">
              Load More NFTs
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && selectedNFT && (
        <PaymentModal
          nft={filteredNFTs.find(n => n.id === selectedNFT)!}
          onClose={() => setShowPayment(false)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};

export default NFTMarketplace;
