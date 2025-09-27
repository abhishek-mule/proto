import axios from 'axios';
import { apiConfig } from '../apiConfig';

const API_URL = `${apiConfig.agriBlockchain}`;

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
      // Backend supports single-asset price; aggregate on client
      const results: Record<string, number> = {};
      for (const sym of symbols) {
        const crypto = sym.toLowerCase() === 'matic' ? 'matic-network' : sym.toLowerCase();
        const resp = await axios.get(`${API_URL}/price-oracle/price`, {
          params: { crypto, currency: 'inr' }
        });
        results[sym] = resp.data?.priceData?.aggregatedPrice || resp.data?.priceData?.price || 0;
      }
      return results;
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
      // Derive vs INR by converting 1 unit to INR
      const rates: Record<string, number> = {};
      for (const cur of currencies) {
        const resp = await axios.get(`${API_URL}/price-oracle/exchange-rate`, {
          params: { from: cur.toUpperCase(), to: 'INR' }
        });
        rates[cur] = resp.data?.exchangeRate?.rate || resp.data?.exchangeRate || 0;
      }
      return rates;
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
      const response = await axios.get(`${API_URL}/price-oracle/exchange-rate`, {
        params: { from: fromCurrency.toUpperCase(), to: toCurrency.toUpperCase() }
      });
      const rate = response.data?.exchangeRate?.rate || response.data?.exchangeRate || 0;
      return { convertedAmount: amount * rate, rate };
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
      // Fallback: use /price endpoint for network-native tokens if supported; otherwise return empty
      const results: Record<string, number> = {};
      for (const addr of tokenAddresses) {
        // Not supported natively; leave placeholder or implement backend support
        results[addr] = 0;
      }
      return results;
    } catch (error) {
      console.error('Error fetching token prices:', error);
      throw error;
    }
  }
};

export default priceOracleService;