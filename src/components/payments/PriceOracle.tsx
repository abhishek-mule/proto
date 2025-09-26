import React, { useState, useEffect } from 'react';
import { ArrowUpDown, RefreshCw, DollarSign, Bitcoin } from 'lucide-react';
import priceOracleService from '../../services/priceOracleService';

interface PriceOracleProps {
  className?: string;
}

const PriceOracle: React.FC<PriceOracleProps> = ({ className = '' }) => {
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, number>>({});
  const [fiatRates, setFiatRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPrices = async () => {
    try {
      setRefreshing(true);
      const [cryptoData, fiatData] = await Promise.all([
        priceOracleService.getCryptoPrices(['ETH', 'BTC', 'MATIC']),
        priceOracleService.getFiatRates(['INR', 'EUR', 'GBP'])
      ]);
      
      setCryptoPrices(cryptoData);
      setFiatRates(fiatData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch latest prices');
      console.error('Price oracle error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    // Refresh prices every 5 minutes
    const interval = setInterval(fetchPrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchPrices();
  };

  if (loading && !refreshing) {
    return (
      <div className={`bg-white rounded-xl shadow-md p-4 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 flex justify-between items-center">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <ArrowUpDown size={18} />
          Price Oracle
        </h3>
        <button 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="text-white hover:bg-white/10 p-1 rounded-full transition-colors"
        >
          <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>
      
      {error ? (
        <div className="p-4 text-red-500 text-center">
          {error}
        </div>
      ) : (
        <div className="p-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1">
              <Bitcoin size={16} className="text-amber-500" />
              Cryptocurrency Prices (USD)
            </h4>
            <div className="space-y-2">
              {Object.entries(cryptoPrices).map(([symbol, price]) => (
                <div key={symbol} className="flex justify-between items-center">
                  <span className="font-medium">{symbol}</span>
                  <span className="text-gray-700">${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1">
              <DollarSign size={16} className="text-green-500" />
              Fiat Exchange Rates (USD)
            </h4>
            <div className="space-y-2">
              {Object.entries(fiatRates).map(([currency, rate]) => (
                <div key={currency} className="flex justify-between items-center">
                  <span className="font-medium">{currency}</span>
                  <span className="text-gray-700">{rate.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceOracle;