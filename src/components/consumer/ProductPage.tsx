import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PaymentSystem from '../payments/PaymentSystem';
import { 
  ArrowLeft, Star, MapPin, Shield, Calendar, Truck, 
  QrCode, Share2, Heart, Plus, Minus, ShoppingCart,
  Leaf, Award, ThermometerSun, Droplets, CheckCircle,
  User, Sprout, AlertTriangle, Bitcoin, Smartphone,
  Eye, Clock, Package, Zap, ChevronDown, ChevronRight,
  Info, CreditCard, Map, FileText, Scan
} from 'lucide-react';

const ProductPage = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [showQR, setShowQR] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'crypto'>('upi');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState<string[]>(['story']);

  // Mock product data (in real app, fetch by ID)
  const product = {
    id: 1,
    name: 'Organic Heirloom Tomatoes',
    farmer: 'John Smith Farm',
    location: 'Sonoma County, California',
    coordinates: { lat: 38.2975, lng: -122.4581 },
    price: 4.50,
    priceInr: 375,
    unit: 'kg',
    rating: 4.9,
    reviews: 127,
    heroImage: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=1200',
    images: [
      'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    description: 'Hand-picked heirloom tomatoes grown using regenerative organic farming practices.',
    badges: ['USDA Organic', 'Non-GMO', 'Pesticide-Free', 'Local Farm'],
    onChainData: {
      farmerName: 'John Smith',
      harvestDate: '2024-01-15',
      cropType: 'Cherokee Purple Heirloom Tomatoes',
      pesticideUse: 'None - 100% Organic',
      certifications: 'USDA Organic, California Certified',
      farmSize: '25 acres',
      soilType: 'Rich Loamy Soil',
      waterSource: 'Natural Spring Water',
      temperature: '22-28°C',
      humidity: '65%',
      phLevel: '6.8',
      nutrients: 'Organic Compost'
    },
    aiStory: `Meet your Cherokee Purple Heirloom Tomatoes - a remarkable journey from seed to your table. These exceptional tomatoes began their life in John Smith's certified organic greenhouse in October 2023, where heritage seeds, passed down through three generations, were carefully planted in nutrient-rich, composted soil.

Throughout their 90-day growing cycle, these tomatoes thrived under California's perfect Mediterranean climate, receiving only natural spring water and organic compost. John's sustainable farming practices include companion planting with marigolds for natural pest control and crop rotation to maintain soil health.

Each tomato was hand-selected at peak ripeness, ensuring maximum flavor and nutritional value. The deep purple-red color and complex, sweet flavor profile make these tomatoes a true delicacy. From our farm to your kitchen, every step has been verified on the blockchain, guaranteeing authenticity and quality you can trust.`
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'traceability', label: 'Trace', icon: FileText },
    { id: 'verification', label: 'Verify', icon: Scan },
    { id: 'location', label: 'Map', icon: Map },
    { id: 'purchase', label: 'Buy', icon: CreditCard }
  ];

  const handlePaymentComplete = (paymentData: any) => {
    console.log('Payment completed:', paymentData);
    setShowPayment(false);
  };

  const handlePayment = (method: 'upi' | 'crypto') => {
    setPaymentMethod(method);
    setShowPayment(true);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const renderOverviewTab = () => (
    <div className="space-y-4">
      {/* Product Description */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200/50">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">About This Product</h3>
        <p className="text-gray-700 leading-relaxed mb-4 text-sm">{product.description}</p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-white/80 rounded-lg">
            <div className="text-xl font-bold text-green-600 mb-1">90</div>
            <div className="text-xs text-gray-600 font-medium">Days Growing</div>
          </div>
          <div className="text-center p-3 bg-white/80 rounded-lg">
            <div className="text-xl font-bold text-blue-600 mb-1">100%</div>
            <div className="text-xs text-gray-600 font-medium">Organic</div>
          </div>
          <div className="text-center p-3 bg-white/80 rounded-lg">
            <div className="text-xl font-bold text-amber-600 mb-1">A+</div>
            <div className="text-xs text-gray-600 font-medium">Grade</div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Shield, title: 'Certified Organic', desc: 'USDA verified organic farming' },
          { icon: Leaf, title: 'Pesticide-Free', desc: 'No harmful chemicals used' },
          { icon: Award, title: 'Heritage Variety', desc: '3rd generation seeds' },
          { icon: Truck, title: 'Fresh Harvest', desc: 'Picked at peak ripeness' }
        ].map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-3 border border-gray-200/50 hover:shadow-md transition-all">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                  <Icon className="h-4 w-4 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-gray-800 text-sm">{feature.title}</h4>
                  <p className="text-xs text-gray-600 truncate">{feature.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTraceabilityTab = () => (
    <div className="space-y-4">
      {/* AI Story Section */}
      <div className="bg-gradient-to-br from-green-50 via-stone-50 to-amber-50 rounded-xl p-4 border border-stone-200/50">
        <button
          onClick={() => toggleSection('story')}
          className="w-full flex items-center justify-between mb-3 group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-stone-800">AI Journey Story</h3>
          </div>
          {expandedSections.includes('story') ? (
            <ChevronDown className="h-5 w-5 text-stone-600 group-hover:text-stone-800 transition-colors" />
          ) : (
            <ChevronRight className="h-5 w-5 text-stone-600 group-hover:text-stone-800 transition-colors" />
          )}
        </button>
        
        {expandedSections.includes('story') && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <p className="text-stone-700 leading-relaxed text-sm">{product.aiStory}</p>
          </div>
        )}
      </div>

      {/* On-Chain Data Cards */}
      <div className="bg-white rounded-xl p-4 border border-stone-200/50">
        <h3 className="text-lg font-bold text-stone-800 mb-3">Verified Farm Data</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { icon: User, label: 'Farmer', value: product.onChainData.farmerName, color: 'green' },
            { icon: Calendar, label: 'Harvest', value: new Date(product.onChainData.harvestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), color: 'blue' },
            { icon: Shield, label: 'Pesticides', value: 'None', color: 'emerald' },
            { icon: Award, label: 'Certified', value: 'USDA Organic', color: 'amber' },
            { icon: Droplets, label: 'Water', value: 'Spring Water', color: 'cyan' },
            { icon: ThermometerSun, label: 'Climate', value: product.onChainData.temperature, color: 'rose' },
            { icon: CheckCircle, label: 'Soil pH', value: product.onChainData.phLevel, color: 'indigo' },
            { icon: Sprout, label: 'Method', value: 'Organic', color: 'purple' }
          ].map((item, index) => {
            const Icon = item.icon;
            const colorClasses = {
              green: 'bg-green-50 text-green-700 border-green-200',
              blue: 'bg-blue-50 text-blue-700 border-blue-200',
              emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              amber: 'bg-amber-50 text-amber-700 border-amber-200',
              cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
              rose: 'bg-rose-50 text-rose-700 border-rose-200',
              indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
              purple: 'bg-purple-50 text-purple-700 border-purple-200'
            };
            
            return (
              <div 
                key={index} 
                className={`${colorClasses[item.color as keyof typeof colorClasses]} rounded-lg p-2 border hover:scale-105 transition-all duration-300 group cursor-pointer`}
              >
                <div className="flex items-center space-x-1 mb-1">
                  <Icon className="h-3 w-3 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-xs font-semibold truncate">{item.label}</span>
                </div>
                <p className="font-bold text-xs text-stone-800 truncate">{item.value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderVerificationTab = () => (
    <div className="space-y-4">
      {/* QR Code Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/50">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-stone-800 mb-2">Blockchain Verification</h3>
            <p className="text-stone-600 mb-3 text-sm">Scan QR code to verify authenticity and view complete supply chain transparency</p>
            <button 
              onClick={() => setShowQR(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <QrCode className="h-4 w-4" />
              <span>View QR Code</span>
            </button>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-lg ml-4">
            <QrCode className="h-12 w-12 text-stone-700" />
          </div>
        </div>
      </div>

      {/* Blockchain Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-800 text-sm">Verified on Blockchain</span>
          </div>
          <div className="space-y-1 text-xs text-green-700">
            <div>✓ Supply chain transparency</div>
            <div>✓ Immutable farming records</div>
            <div>✓ Authentic product guarantee</div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-blue-800 text-sm">Security Features</span>
          </div>
          <div className="space-y-1 text-xs text-blue-700">
            <div>✓ Tamper-proof records</div>
            <div>✓ Real-time verification</div>
            <div>✓ Fraud protection</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLocationTab = () => (
    <div className="space-y-4">
      {/* Interactive Map */}
      <div className="bg-white rounded-xl border border-stone-200/50 overflow-hidden">
        <div className="aspect-[16/10] bg-gradient-to-br from-green-100 via-amber-100 to-blue-100 relative group">
          {/* Mock Interactive Map */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-center transform group-hover:scale-105 transition-transform duration-500">
              <div className="relative mb-3">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -inset-3 bg-red-400/30 rounded-full animate-ping"></div>
              </div>
              <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-xl border border-stone-200/50 max-w-xs">
                <h3 className="font-bold text-stone-800 mb-1 text-sm">{product.farmer}</h3>
                <p className="text-stone-600 text-xs mb-2 truncate">{product.location}</p>
                <div className="flex items-center justify-center space-x-2 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-stone-600">Verified Location</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map Controls */}
          <div className="absolute top-3 right-3 space-y-2">
            <button className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white hover:scale-110 transition-all duration-300">
              <Plus className="h-4 w-4 text-stone-600" />
            </button>
            <button className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white hover:scale-110 transition-all duration-300">
              <Minus className="h-4 w-4 text-stone-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Farm Details */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-stone-50 rounded-lg p-3">
          <h4 className="font-semibold text-stone-800 mb-1 text-sm">Farm Size</h4>
          <p className="text-stone-600 text-sm">{product.onChainData.farmSize}</p>
        </div>
        <div className="bg-stone-50 rounded-lg p-3">
          <h4 className="font-semibold text-stone-800 mb-1 text-sm">Coordinates</h4>
          <p className="text-stone-600 text-xs font-mono">{product.coordinates.lat}, {product.coordinates.lng}</p>
        </div>
      </div>
    </div>
  );

  const renderPurchaseTab = () => (
    <div className="space-y-4">
      {/* Quantity & Pricing */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200/50">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Purchase Details</h3>
        
        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-700 font-medium text-sm">Quantity:</span>
          <div className="flex items-center bg-white border-2 border-gray-200 rounded-lg shadow-sm">
            <button
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg disabled:opacity-50"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4 text-gray-600" />
            </button>
            <span className="px-4 py-2 min-w-[3rem] text-center font-semibold text-gray-800 text-sm">
              {quantity} kg
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
            >
              <Plus className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-white rounded-lg p-3 border border-gray-200/50">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Unit Price (INR):</span>
              <span className="font-semibold text-gray-800 text-sm">₹{product.priceInr}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Unit Price (USD):</span>
              <span className="font-semibold text-gray-800 text-sm">${product.price}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Crypto Price:</span>
              <span className="font-semibold text-blue-600 text-sm">{(product.price / 2000).toFixed(6)} ETH</span>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-800">Total:</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800">₹{(product.priceInr * quantity).toLocaleString()}</div>
                  <div className="text-xs text-gray-600">${(product.price * quantity).toFixed(2)} • {((product.price * quantity) / 2000).toFixed(6)} ETH</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Buttons */}
      <div className="space-y-3">
        {/* Prominent Buy Now Section */}
        <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-2 border-green-200 rounded-xl p-4">
          <div className="text-center mb-3">
            <h3 className="text-xl font-bold text-green-800 mb-1">🛒 Buy Now</h3>
            <p className="text-green-700 text-sm">Choose your preferred payment method</p>
          </div>
          
          <div className="space-y-3">
            {/* UPI Payment - Enhanced */}
            <button
              onClick={() => handlePayment('upi')}
              className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-4 px-5 rounded-xl font-bold hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transition-all hover:scale-105 flex items-center justify-between shadow-lg hover:shadow-xl group relative overflow-hidden border-2 border-blue-500"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="flex items-center space-x-3 relative z-10">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <span className="text-base font-bold">Pay with UPI</span>
                  <p className="text-blue-200 text-xs">PhonePe • Google Pay • Paytm</p>
                </div>
              </div>
              <div className="bg-blue-500/80 px-3 py-1.5 rounded-lg font-bold relative z-10">
                ₹{(product.priceInr * quantity).toLocaleString()}
              </div>
            </button>

            {/* Crypto Payment - Enhanced */}
            <button
              onClick={() => handlePayment('crypto')}
              className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white py-4 px-5 rounded-xl font-bold hover:from-purple-700 hover:via-purple-800 hover:to-indigo-800 transition-all hover:scale-105 flex items-center justify-between shadow-lg hover:shadow-xl group relative overflow-hidden border-2 border-purple-500"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="flex items-center space-x-3 relative z-10">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Bitcoin className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <span className="text-base font-bold">Pay with Crypto</span>
                  <p className="text-purple-200 text-xs">ETH • BTC • USDC</p>
                </div>
              </div>
              <div className="bg-purple-500/80 px-3 py-1.5 rounded-lg font-bold relative z-10">
                {((product.price * quantity) / 2000).toFixed(6)} ETH
              </div>
            </button>
          </div>
        </div>

        {/* Alternative Methods Divider */}
        <div className="text-center">
          <p className="text-gray-500 text-xs">Or choose alternative payment methods</p>
        </div>

        {/* Alternative Payment Methods */}
        <div className="grid grid-cols-2 gap-2">
          <button className="bg-white border-2 border-gray-200 text-gray-700 py-2.5 px-3 rounded-lg font-medium hover:border-gray-300 hover:bg-gray-50 transition-all text-sm">
            💳 Card Payment
          </button>
          <button className="bg-white border-2 border-gray-200 text-gray-700 py-2.5 px-3 rounded-lg font-medium hover:border-gray-300 hover:bg-gray-50 transition-all text-sm">
            🏦 Bank Transfer
          </button>
        </div>

        {/* Security Notice */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <Shield className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <span className="font-medium text-green-800 text-sm">Secure Payment Guarantee</span>
              <p className="text-green-700 text-xs mt-1">All transactions secured with blockchain technology</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/20 pb-20">
      {/* Breadcrumb */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm">
            <Link 
              to="/marketplace" 
              className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors font-medium group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Marketplace</span>
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content - Optimized Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          
          {/* Left Column: Product Images & Basic Info */}
          <div className="lg:col-span-2 space-y-4">
            {/* Hero Image Gallery */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-4">
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-md group mb-3">
                <img
                  src={product.images[activeImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Image Actions */}
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white hover:scale-105 transition-all shadow-md">
                    <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                  </button>
                  <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white hover:scale-105 transition-all shadow-md">
                    <Share2 className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                {/* Quality Badge */}
                <div className="absolute bottom-3 left-3">
                  <div className="bg-green-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
                    Premium Grade A+
                  </div>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex space-x-2 justify-center overflow-x-auto pb-1">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative aspect-square w-14 rounded-md overflow-hidden transition-all flex-shrink-0 ${
                      activeImageIndex === index 
                        ? 'ring-2 ring-green-500 ring-offset-1 scale-105' 
                        : 'hover:scale-105 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Basic Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-5">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-medium text-xs uppercase tracking-wide">Fresh & Available</span>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-800 mb-3 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 text-gray-600 mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-green-700" />
                  </div>
                  <span className="font-medium text-sm">{product.farmer}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-xs font-medium truncate">{product.location}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-800 text-sm">{product.rating}</span>
                </div>
                <span className="text-gray-600 text-xs">({product.reviews} reviews)</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.badges.slice(0, 3).map((badge, index) => (
                  <span 
                    key={badge} 
                    className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm transition-all hover:scale-105 ${
                      index % 2 === 0 
                        ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' 
                        : 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800'
                    }`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Tabbed Content */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 bg-gray-50/50">
              <nav className="flex overflow-x-auto scrollbar-hide">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-shrink-0 py-3 px-4 text-sm font-medium transition-all flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'text-green-600 border-b-2 border-green-500 bg-white'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/50'
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
            <div className="p-5 max-h-[calc(100vh-20rem)] overflow-y-auto">
              <div className="animate-in fade-in-50 duration-200">
                {activeTab === 'overview' && renderOverviewTab()}
                {activeTab === 'traceability' && renderTraceabilityTab()}
                {activeTab === 'verification' && renderVerificationTab()}
                {activeTab === 'location' && renderLocationTab()}
                {activeTab === 'purchase' && renderPurchaseTab()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center transform animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Blockchain Verification QR</h3>
            <div className="w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-inner">
              <QrCode className="h-20 w-20 text-gray-500" />
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed text-sm">
              Scan with your mobile device to view complete supply chain verification
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowQR(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all"
              >
                Close
              </button>
              <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all hover:scale-105">
                Download
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment Modal */}
      {showPayment && (
        <PaymentSystem
          amount={paymentMethod === 'upi' ? product.priceInr * quantity : product.price * quantity}
          productName={`${product.name} (${quantity} ${product.unit})`}
          onPaymentComplete={handlePaymentComplete}
          onClose={() => setShowPayment(false)}
          currency={paymentMethod === 'upi' ? 'INR' : 'USD'}
          paymentMethod={paymentMethod}
        />
      )}
    </div>
  );
};

export default ProductPage;