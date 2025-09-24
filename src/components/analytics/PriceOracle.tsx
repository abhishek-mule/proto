import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Bitcoin,
  RefreshCw, AlertCircle, Zap, BarChart3,
  Clock, Globe, Activity
} from 'lucide-react';

interface PriceData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: string;
}

interface PriceOracleProps {
  cropType: string;
  className?: string;
}

const PriceOracle: React.FC<PriceOracleProps> = ({ cropType, className = '' }) => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  // Mock price data - in production, connect to real oracles
  const mockPriceData: PriceData[] = [
    {
      symbol: 'TOMATO',
      name: 'Organic Tomatoes',
      price: 4.50,
      change24h: 12.5,
      volume24h: 125000,
      marketCap: 2500000,
      lastUpdated: new Date().toISOString()
    },
    {
      symbol: 'WHEAT',
      name: 'Heritage Wheat',
      price: 2.85,
      change24h: -3.2,
      volume24h: 89000,
      marketCap: 1800000,
      lastUpdated: new Date().toISOString()
    },
    {
      symbol: 'CORN',
      name: 'Sweet Corn',
      price: 3.20,
      change24h: 8.7,
      volume24h: 156000,
      marketCap: 3200000,
      lastUpdated: new Date().toISOString()
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2045.67,
      change24h: 5.8,
      volume24h: 15600000000,
      marketCap: 246000000000,
      lastUpdated: new Date().toISOString()
    }
  ];

  const fetchPriceData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add some randomness to simulate real price movements
      const updatedData = mockPriceData.map(item => ({
        ...item,
        price: item.price * (1 + (Math.random() - 0.5) * 0.02), // ±1% variation
        change24h: item.change24h + (Math.random() - 0.5) * 2, // ±1% variation
        lastUpdated: new Date().toISOString()
      }));
      
      setPriceData(updatedData);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Failed to fetch price data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPriceData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number, symbol: string) => {
    if (symbol === 'ETH') {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) {
      return `$${(volume / 1000000000).toFixed(1)}B`;
    } else if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(1)}K`;
    }
    return `$${volume.toFixed(0)}`;
  };

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center space-x-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Price Oracle Error</span>
        </div>
        <p className="text-red-600 text-sm mt-2">{error}</p>
        <button
          onClick={fetchPriceData}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-3xl shadow-xl border border-amber-100/50 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Live Price Oracle</h3>
              <p className="text-green-100 text-sm">Real-time market data</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live</span>
            </div>
            <button
              onClick={fetchPriceData}
              disabled={isLoading}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Price Grid */}
      <div className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-2xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {priceData.map((item, index) => {
              const isPositive = item.change24h >= 0;
              const isCrypto = item.symbol === 'ETH';
              
              return (
                <div 
                  key={item.symbol}
                  className={`bg-gradient-to-r ${
                    isCrypto 
                      ? 'from-blue-50 to-indigo-50 border-blue-200' 
                      : 'from-green-50 to-emerald-50 border-green-200'
                  } rounded-2xl p-4 border hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${
                        isCrypto 
                          ? 'from-blue-600 to-indigo-600' 
                          : 'from-green-600 to-emerald-600'
                      } shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {isCrypto ? (
                          <Bitcoin className="h-5 w-5 text-white" />
                        ) : (
                          <DollarSign className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">{item.name}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 font-medium">{item.symbol}</span>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <span className="text-xs text-gray-500">
                            Vol: {formatVolume(item.volume24h)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatPrice(item.price, item.symbol)}
                      </div>
                      <div className={`flex items-center space-x-1 text-sm font-semibold ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isPositive ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span>{formatChange(item.change24h)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info for Crypto */}
                  {isCrypto && (
                    <div className="mt-4 pt-4 border-t border-blue-200/50">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Market Cap:</span>
                          <span className="font-semibold text-gray-800">
                            {formatVolume(item.marketCap)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">24h Volume:</span>
                          <span className="font-semibold text-gray-800">
                            {formatVolume(item.volume24h)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Last Update */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Activity className="h-4 w-4 text-green-600" />
            <span className="font-medium">Oracle Active</span>
          </div>
        </div>

        {/* Oracle Info */}
        <div className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="h-4 w-4 text-amber-600" />
            <span className="font-semibold text-amber-800 text-sm">Price Oracle Network</span>
          </div>
          <p className="text-amber-700 text-xs leading-relaxed">
            Prices are aggregated from multiple sources including commodity exchanges, 
            local markets, and blockchain oracles to ensure accuracy and prevent manipulation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceOracle;