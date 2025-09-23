import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Shield, Leaf, Truck, Heart } from 'lucide-react';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

  const categories = [
    { id: 'all', name: 'All Products', count: 48 },
    { id: 'vegetables', name: 'Vegetables', count: 24 },
    { id: 'fruits', name: 'Fruits', count: 16 },
    { id: 'grains', name: 'Grains & Cereals', count: 8 },
  ];

  const products = [
    {
      id: 1,
      name: 'Organic Heirloom Tomatoes',
      farmer: 'John Smith Farm',
      location: 'California, USA',
      price: 4.50,
      unit: 'kg',
      rating: 4.9,
      reviews: 127,
      image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400',
      badges: ['Organic', 'Local', 'Pesticide-Free'],
      distance: '12 km away',
      inStock: true,
      harvestDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Free-Range Heritage Carrots',
      farmer: 'Green Valley Co-op',
      location: 'Oregon, USA',
      price: 3.20,
      unit: 'kg',
      rating: 4.8,
      reviews: 89,
      image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400',
      badges: ['Organic', 'Non-GMO'],
      distance: '8 km away',
      inStock: true,
      harvestDate: '2024-01-12'
    },
    {
      id: 3,
      name: 'Sweet Corn Variety Pack',
      farmer: 'Sunshine Farms',
      location: 'Iowa, USA',
      price: 2.80,
      unit: 'kg',
      rating: 4.7,
      reviews: 156,
      image: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=400',
      badges: ['Local', 'Sweet Variety'],
      distance: '15 km away',
      inStock: true,
      harvestDate: '2024-01-18'
    },
    {
      id: 4,
      name: 'Hydroponic Lettuce Mix',
      farmer: 'Urban Greens',
      location: 'New York, USA',
      price: 5.90,
      unit: 'kg',
      rating: 4.6,
      reviews: 73,
      image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=400',
      badges: ['Hydroponic', 'Year-Round'],
      distance: '3 km away',
      inStock: true,
      harvestDate: '2024-01-20'
    },
    {
      id: 5,
      name: 'Organic Apple Orchard Mix',
      farmer: 'Mountain View Orchard',
      location: 'Washington, USA',
      price: 6.20,
      unit: 'kg',
      rating: 4.9,
      reviews: 204,
      image: 'https://images.pexels.com/photos/209439/pexels-photo-209439.jpeg?auto=compress&cs=tinysrgb&w=400',
      badges: ['Organic', 'Tree-Ripened'],
      distance: '22 km away',
      inStock: false,
      harvestDate: '2024-01-10'
    },
    {
      id: 6,
      name: 'Heritage Wheat Grain',
      farmer: 'Prairie Gold Farm',
      location: 'Kansas, USA',
      price: 1.85,
      unit: 'kg',
      rating: 4.8,
      reviews: 91,
      image: 'https://images.pexels.com/photos/326059/pexels-photo-326059.jpeg?auto=compress&cs=tinysrgb&w=400',
      badges: ['Heritage', 'Stone Ground'],
      distance: '45 km away',
      inStock: true,
      harvestDate: '2024-01-05'
    }
  ];

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && !product.name.toLowerCase().includes(selectedCategory)) {
      return false;
    }
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 space-y-6 md:space-y-8 pb-24 md:pb-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl md:rounded-3xl text-white p-6 md:p-8 lg:p-12 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="relative max-w-4xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            Fresh, Traceable, Direct from Farm
          </h1>
          <p className="text-green-100 text-lg md:text-xl mb-6 md:mb-8 leading-relaxed max-w-2xl">
            Discover premium produce with complete blockchain transparency. Every item tells the story of its journey from seed to your table.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-6 text-sm md:text-base">
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Shield className="h-4 w-4" />
              <span>Blockchain Verified</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Leaf className="h-4 w-4" />
              <span>Sustainably Grown</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Truck className="h-4 w-4" />
              <span>Direct from Farmer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl md:rounded-3xl shadow-xl border border-gray-100/50 p-4 md:p-6 lg:p-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for fresh produce..."
              className="w-full pl-10 md:pl-12 pr-4 md:pr-6 py-3 md:py-4 border-2 border-gray-200 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-base md:text-lg placeholder-gray-400"
            />
          </div>

          {/* Filters - Horizontal on mobile */}
          <div className="flex space-x-3 lg:space-x-0 lg:space-y-0">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 lg:flex-none px-3 md:px-6 py-3 md:py-4 border-2 border-gray-200 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-sm md:text-base font-medium"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name.split(' ')[0]} {/* Show only first word on mobile */}
                  <span className="hidden md:inline"> ({category.count})</span>
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 lg:flex-none px-3 md:px-6 py-3 md:py-4 border-2 border-gray-200 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-sm md:text-base font-medium"
            >
              <option value="popularity">Popular</option>
              <option value="price-low">Price ↑</option>
              <option value="price-high">Price ↓</option>
              <option value="distance">Nearest</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-xl md:rounded-3xl shadow-lg border border-gray-100/50 overflow-hidden hover-lift group cursor-pointer">
            {/* Product Image */}
            <div className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-t-xl md:rounded-t-3xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-red-500 text-white px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-semibold shadow-lg">
                    Out of Stock
                  </span>
                </div>
              )}
              <button className="absolute top-2 md:top-4 right-2 md:right-4 p-2 md:p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
                <Heart className="h-3 w-3 md:h-5 md:w-5 text-gray-600 hover:text-red-500" />
              </button>
              
              {/* Badges */}
              <div className="absolute top-2 md:top-4 left-2 md:left-4 flex flex-wrap gap-1 md:gap-2">
                {product.badges.slice(0, 2).map(badge => (
                  <span
                    key={badge}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full font-semibold shadow-lg backdrop-blur-sm"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-3 md:p-6">
              <div className="flex items-start justify-between mb-2 md:mb-3">
                <h3 className="text-sm md:text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors leading-tight flex-1 mr-2">
                  {product.name}
                </h3>
                <div className="text-right">
                  <p className="text-lg md:text-2xl font-bold text-gray-900">
                    ${product.price}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 font-medium">per {product.unit}</p>
                </div>
              </div>

              {/* Farmer Info */}
              <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-4">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full"></div>
                </div>
                <span className="text-xs md:text-base text-gray-700 font-semibold truncate">{product.farmer}</span>
              </div>

              {/* Location & Distance */}
              <div className="flex items-center justify-between text-xs md:text-sm text-gray-600 mb-2 md:mb-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="truncate">{product.location.split(',')[0]}</span>
                </div>
                <span className="text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full text-xs">{product.distance}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between mb-3 md:mb-6">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs md:text-sm font-semibold text-gray-700">{product.rating}</span>
                  </div>
                  <span className="text-xs md:text-sm text-gray-500 font-medium hidden md:inline">({product.reviews})</span>
                </div>
                <span className="text-xs text-gray-500 font-medium hidden md:inline">
                  Harvested {new Date(product.harvestDate).toLocaleDateString()}
                </span>
              </div>

              {/* CTA Button */}
              <Link
                to={`/product/${product.id}`}
                className={`w-full py-2 md:py-4 px-3 md:px-6 rounded-xl md:rounded-2xl font-semibold text-center transition-all duration-300 block hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base ${
                  product.inStock
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed hover:scale-100'
                }`}
              >
                {product.inStock ? (
                  <span className="md:hidden">View Details</span>
                ) : (
                  <span className="md:hidden">Notify Me</span>
                )}
                <span className="hidden md:inline">
                  {product.inStock ? 'View Details & Trace Origin' : 'Notify When Available'}
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="bg-white border-2 border-green-500 text-green-600 px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold hover:bg-green-50 hover:border-green-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base">
          Load More Products
        </button>
      </div>
    </div>
  );
};

export default Marketplace;