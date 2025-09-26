import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Service for interacting with the price oracle API
 */
const priceOracleService = {
  /**
   * Get cryptocurrency prices in USD
   * @param symbols Array of cryptocurrency symbols (e.g., ['BTC', 'ETH'])
   * @returns Object with symbol-price pairs
   */
  async getCryptoPrices(symbols: string[] = []): Promise<Record<string, number>> {
    try {
      const response = await axios.get(`${API_URL}/price-oracle/crypto-prices`, {
        params: { symbols: symbols.join(',') }
      });
      return response.data.prices;
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      throw error;
    }
  },

  /**
   * Get fiat currency exchange rates relative to USD
   * @param currencies Array of fiat currency codes (e.g., ['EUR', 'JPY'])
   * @returns Object with currency-rate pairs
   */
  async getFiatRates(currencies: string[] = []): Promise<Record<string, number>> {
    try {
      const response = await axios.get(`${API_URL}/price-oracle/fiat-rates`, {
        params: { currencies: currencies.join(',') }
      });
      return response.data.rates;
    } catch (error) {
      console.error('Error fetching fiat rates:', error);
      throw error;
    }
  },

  /**
   * Convert between currencies (crypto or fiat)
   * @param amount Amount to convert
   * @param fromCurrency Source currency code
   * @param toCurrency Target currency code
   * @returns Converted amount
   */
  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<{ convertedAmount: number; rate: number }> {
    try {
      const response = await axios.get(`${API_URL}/price-oracle/convert`, {
        params: { amount, from: fromCurrency, to: toCurrency }
      });
      return response.data;
    } catch (error) {
      console.error('Error converting currency:', error);
      throw error;
    }
  },

  /**
   * Get token prices for specific blockchain tokens
   * @param tokenAddresses Array of token contract addresses
   * @param chainId Blockchain network ID (default: 1 for Ethereum mainnet)
   * @returns Object with token address-price pairs
   */
  async getTokenPrices(
    tokenAddresses: string[],
    chainId: number = 1
  ): Promise<Record<string, number>> {
    try {
      const response = await axios.get(`${API_URL}/price-oracle/token-prices`, {
        params: { 
          addresses: tokenAddresses.join(','),
          chainId 
        }
      });
      return response.data.prices;
    } catch (error) {
      console.error('Error fetching token prices:', error);
      throw error;
    }
  }
};

export default priceOracleService;