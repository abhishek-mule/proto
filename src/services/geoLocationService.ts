import axios from 'axios';
import { apiConfig } from '../apiConfig';

const GEO_LOCATION_API = `${apiConfig.agriBlockchain}/geo-location`;

export interface GeoLocation {
  _id?: string;
  tokenId: string;
  locationName: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timestamp: Date | string;
  stage: 'PLANTING' | 'GROWING' | 'HARVESTING' | 'PROCESSING' | 'PACKAGING' | 'DISTRIBUTION' | 'RETAIL';
  description?: string;
  verifiedBy?: string;
  metadata?: Record<string, string>;
}

// Cache mechanism
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache: Record<string, CacheEntry<unknown>> = {};
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes

// Helper to check if cache is valid
const isCacheValid = (key: string): boolean => {
  if (!cache[key]) return false;
  return Date.now() - cache[key].timestamp < CACHE_EXPIRY;
};

// Helper to get cached data
const getCachedData = <T>(key: string): T | null => {
  if (!isCacheValid(key)) return null;
  return cache[key].data as T;
};

// Helper to set cache
const setCacheData = <T>(key: string, data: T): void => {
  cache[key] = {
    data,
    timestamp: Date.now()
  };
  // Also store in localStorage for persistence across sessions
  try {
    localStorage.setItem(`geo_cache_${key}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Failed to store in localStorage:', error);
  }
};

// Initialize cache from localStorage
const initializeCache = (): void => {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('geo_cache_')) {
        const value = localStorage.getItem(key);
        if (value) {
          const parsedValue = JSON.parse(value);
          const cacheKey = key.replace('geo_cache_', '');
          cache[cacheKey] = parsedValue;
        }
      }
    }
  } catch (error) {
    console.warn('Failed to initialize cache from localStorage:', error);
  }
};

// Initialize cache on module load
initializeCache();

/**
 * Service for interacting with the geo-location tracking API
 * with improved error handling and caching
 */
const geoLocationService = {
  /**
   * Add a new location entry
   * @param locationData - Location data to add
   * @returns Promise with the created location
   */
  async addLocation(locationData: GeoLocation): Promise<GeoLocation> {
    try {
      const response = await axios.post(GEO_LOCATION_API, locationData, {
        timeout: 5000 // 5 second timeout
      });
      
      // Update cache for this token's history
      const cacheKey = `history_${locationData.tokenId}`;
      const cachedHistory = getCachedData<GeoLocation[]>(cacheKey) || [];
      setCacheData(cacheKey, [...cachedHistory, response.data.location]);
      
      return response.data.location;
    } catch (error) {
      console.error('Error adding location:', error);
      throw new Error('Failed to add location data. Please try again later.');
    }
  },

  /**
   * Get location history for a token
   * @param tokenId - NFT token ID
   * @returns Promise with location history
   */
  async getLocationHistory(tokenId: string): Promise<GeoLocation[]> {
    const cacheKey = `history_${tokenId}`;
    
    // Check cache first
    const cachedData = getCachedData<GeoLocation[]>(cacheKey);
    if (cachedData) {
      console.log('Using cached location history data');
      return cachedData;
    }
    
    try {
      const response = await axios.get(`${GEO_LOCATION_API}/token/${tokenId}`, {
        timeout: 5000 // 5 second timeout
      });
      
      // Cache the result
      setCacheData(cacheKey, response.data.locations);
      
      return response.data.locations;
    } catch (error) {
      console.error('Error fetching location history:', error);
      
      // Try to get data from localStorage even if cache expired
      try {
        const localStorageKey = `geo_cache_${cacheKey}`;
        const storedData = localStorage.getItem(localStorageKey);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          return parsedData.data;
        }
      } catch (localStorageError) {
        console.warn('Failed to retrieve from localStorage:', localStorageError);
      }
      
      throw new Error('Failed to fetch location history. Please check your connection and try again.');
    }
  },

  /**
   * Get current location for a token
   * @param tokenId - NFT token ID
   * @returns Promise with current location
   */
  async getCurrentLocation(tokenId: string): Promise<GeoLocation | null> {
    const cacheKey = `current_${tokenId}`;
    
    // Check cache first (with shorter expiry for current location)
    const cachedData = getCachedData<GeoLocation>(cacheKey);
    if (cachedData && Date.now() - cache[cacheKey].timestamp < 5 * 60 * 1000) { // 5 minutes for current location
      return cachedData;
    }
    
    try {
      const response = await axios.get(`${GEO_LOCATION_API}/current/${tokenId}`, {
        timeout: 5000
      });
      
      // Cache the result
      setCacheData(cacheKey, response.data.location);
      
      return response.data.location;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      
      console.error('Error fetching current location:', error);
      
      // If we have cached history, return the most recent location
      try {
        const historyKey = `history_${tokenId}`;
        const historyData = getCachedData<GeoLocation[]>(historyKey);
        if (historyData && historyData.length > 0) {
          // Sort by timestamp and get the most recent
          const sortedLocations = [...historyData].sort((a, b) => 
            new Date(b.timestamp as string).getTime() - new Date(a.timestamp as string).getTime()
          );
          return sortedLocations[0];
        }
      } catch (cacheError) {
        console.warn('Failed to get location from cache:', cacheError);
      }
      
      throw new Error('Failed to fetch current location. Please check your connection and try again.');
    }
  },

  /**
   * Find nearby locations
   * @param lat - Latitude
   * @param lng - Longitude
   * @param radius - Radius in kilometers (default: 10)
   * @returns Promise with nearby locations
   */
  async findNearbyLocations(lat: number, lng: number, radius: number = 10): Promise<GeoLocation[]> {
    const cacheKey = `nearby_${lat}_${lng}_${radius}`;
    
    // Check cache first
    const cachedData = getCachedData<GeoLocation[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    try {
      const response = await axios.get(`${GEO_LOCATION_API}/nearby`, {
        params: { lat, lng, radius },
        timeout: 5000
      });
      
      // Cache the result
      setCacheData(cacheKey, response.data.locations);
      
      return response.data.locations;
    } catch (error) {
      console.error('Error finding nearby locations:', error);
      throw new Error('Failed to find nearby locations. Please check your connection and try again.');
    }
  },

  /**
   * Get location statistics
   * @returns Promise with location statistics
   */
  async getLocationStats(): Promise<{
    totalLocations: number;
    uniqueTokens: number;
    [key: string]: number | string;  // Allow for additional stats
  }> {
    const cacheKey = 'stats';
    
    // Check cache first
    const cachedData = getCachedData<{
      totalLocations: number;
      uniqueTokens: number;
      [key: string]: number | string;
    }>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    try {
      const response = await axios.get(`${GEO_LOCATION_API}/stats`, {
        timeout: 5000
      });
      
      // Cache the result
      setCacheData(cacheKey, response.data.stats);
      
      return response.data.stats;
    } catch (error) {
      console.error('Error fetching location stats:', error);
      return { totalLocations: 0, uniqueTokens: 0 }; // Return default values on error
    }
  },
  
  /**
   * Check backend connectivity
   * @returns Promise with connectivity status
   */
  async checkConnectivity(): Promise<boolean> {
    try {
      await axios.get(`${GEO_LOCATION_API}/health`, { 
        timeout: 3000 
      });
      return true;
    } catch (error) {
      console.warn('Backend connectivity check failed:', error);
      return false;
    }
  }
};

export default geoLocationService;
