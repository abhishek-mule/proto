import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, TrendingUp, Grid, List, Map } from 'lucide-react';
import NFTCard from './NFTCard';
import FarmLocator from '../maps/FarmLocator';
import PaymentModal from '../payments/PaymentModal';

const NFTMarketplace: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);

  // Mock NFT data
  const nfts = [
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
      verificationStatus: 'verified' as const,
      certifications: ['USDA Organic', 'Non-GMO', 'Fair Trade'],
      supplyChainStage: 'harvested' as const,
      coordinates: { lat: 38.2975, lng: -122.4581 },
      batchSize: '500kg',
      organicCertified: true
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
      verificationStatus: 'verified' as const,
      certifications: ['Heritage Variety', 'Sustainable'],
      supplyChainStage: 'processed' as const,
      coordinates: { lat: 39.0119, lng: -98.4842 },
      batchSize: '1000kg',
      organicCertified: false
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
      verificationStatus: 'pending' as const,
      certifications: ['Hydroponic', 'Local'],
      supplyChainStage: 'growing' as const,
      coordinates: { lat: 40.6782, lng: -73.9442 },
      batchSize: '200kg',
      organicCertified: false
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
      verificationStatus: 'verified' as const,
      certifications: ['USDA Organic', 'Biodynamic'],
      supplyChainStage: 'shipped' as const,
      coordinates: { lat: 44.9778, lng: -123.0351 },
      batchSize: '750kg',
      organicCertified: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Crops', count: nfts.length },
    { id: 'vegetables', name: 'Vegetables', count: 3 },
    { id: 'grains', name: 'Grains', count: 1 },
    { id: 'organic', name: 'Organic Only', count: 2 }
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
      if (selectedCategory === 'vegetables' && !nft.cropName.toLowerCase().includes('tomato') && !nft.cropName.toLowerCase().includes('lettuce') && !nft.cropName.toLowerCase().includes('carrot')) return false;
      if (selectedCategory === 'grains' && !nft.cropName.toLowerCase().includes('wheat')) return false;
    }
    if (searchTerm && !nft.cropName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-yellow-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Agricultural NFT Marketplace
          </h1>
          <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover, verify, and own unique crop NFTs with complete blockchain traceability from farm to table
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-lg">
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-3xl shadow-xl border border-amber-100/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for crops, farmers, or locations..."
                className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-lg placeholder-gray-400"
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
        {viewMode === 'map' ? (
          <div className="bg-white rounded-3xl shadow-xl border border-amber-100/50 overflow-hidden">
            <FarmLocator 
              farms={filteredNFTs.map(nft => ({
                id: nft.id,
                name: nft.farmerName,
                location: nft.farmLocation,
                coordinates: nft.coordinates,
                crops: [nft.cropName],
                nftCount: 1,
                verificationStatus: nft.verificationStatus,
                image: nft.cropImage
              }))}
              onFarmSelect={(farmId) => console.log('Selected farm:', farmId)}
            />
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
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
        {viewMode !== 'map' && (
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
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