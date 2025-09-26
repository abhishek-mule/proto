import axios from 'axios';
import { apiConfig } from '../apiConfig';

const NARRATIVE_API = `${apiConfig.agriBlockchain}/narrative`;
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes in milliseconds

export interface CropData {
  cropType: string;
  variety?: string;
  farmerName?: string;
  farmLocation?: string;
  plantingDate: Date | string;
  harvestDate?: Date | string;
  farmingPractices?: string;
  certifications?: string;
  supplyChainEvents?: SupplyChainEvent[];
  waterUsage?: string;
  carbonFootprint?: string;
  pesticideUse?: string;
}

export interface SupplyChainEvent {
  timestamp: Date | string;
  description: string;
  location?: {
    locationName: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
}

export interface NarrativeResponse {
  data: string;
  source: 'live' | 'cached' | 'mock';
  timestamp: number;
}

// Mock data for fallback when API is unavailable
const mockNarratives = {
  cropStory: {
    'wheat': 'This wheat was grown using sustainable farming practices in the heartland region. It was planted in early spring and harvested in late summer, then transported to local mills for processing.',
    'corn': 'This corn was grown on a family farm using traditional methods. After harvest, it was carefully inspected and transported to distribution centers.',
    'default': 'This crop was grown with care by local farmers committed to sustainable agriculture practices.'
  },
  environmentalImpact: {
    'wheat': 'This wheat crop was grown with 30% less water than conventional methods. The farm uses solar power for operations, reducing carbon emissions by approximately 25%.',
    'corn': 'This corn was grown using integrated pest management, reducing pesticide use by 40%. Crop rotation practices help maintain soil health.',
    'default': 'This crop was grown using methods designed to minimize environmental impact and promote sustainability.'
  },
  cookingSuggestions: {
    'wheat': 'This wheat can be milled into flour for bread, pasta, or pastries. For whole grain options, try wheat berries in salads or soups.',
    'corn': 'This corn is perfect for grilling, boiling, or roasting. Try it in salads, salsas, or as a side dish with butter and herbs.',
    'default': 'This crop can be prepared using various cooking methods to bring out its natural flavors and nutritional benefits.'
  }
};

/**
 * Service for interacting with the AI narrative generation API
 */
const narrativeService = {
  /**
   * Check if the backend API is available
   * @returns Promise<boolean> indicating if the API is reachable
   */
  async checkConnectivity(): Promise<boolean> {
    try {
      await axios.get(`${API_BASE_URL}/api/health`, { timeout: 3000 });
      return true;
    } catch (error) {
      console.warn('Backend API is not available:', error);
      return false;
    }
  },

  /**
   * Get cached narrative data if available
   * @param key - Cache key
   * @returns Cached data or null if not found or expired
   */
  getCachedData(key: string): NarrativeResponse | null {
    try {
      const cachedData = localStorage.getItem(`narrative_${key}`);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        // Check if cache is still valid
        if (Date.now() - parsed.timestamp < CACHE_EXPIRY) {
          return parsed;
        }
      }
      return null;
    } catch (error) {
      console.warn('Error reading from cache:', error);
      return null;
    }
  },

  /**
   * Save data to cache
   * @param key - Cache key
   * @param data - Data to cache
   */
  saveToCache(key: string, data: string): void {
    try {
      const cacheData: NarrativeResponse = {
        data,
        source: 'live',
        timestamp: Date.now()
      };
      localStorage.setItem(`narrative_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Error saving to cache:', error);
    }
  },

  /**
   * Get mock data based on crop type
   * @param cropType - Type of crop
   * @param narrativeType - Type of narrative (cropStory, environmentalImpact, cookingSuggestions)
   * @returns Mock narrative data
   */
  getMockData(cropType: string, narrativeType: string): NarrativeResponse {
    const mockData = mockNarratives[narrativeType][cropType.toLowerCase()] || 
                     mockNarratives[narrativeType].default;
    
    return {
      data: mockData,
      source: 'mock',
      timestamp: Date.now()
    };
  },

  /**
   * Generate a story about a crop's journey
   * @param cropData - Data about the crop
   * @returns Promise with the generated story and source information
   */
  async generateCropStory(cropData: CropData): Promise<NarrativeResponse> {
    const cacheKey = `cropStory_${cropData.cropType}_${cropData.farmLocation || 'unknown'}`;
    
    // Try to get from cache first
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // Check API connectivity
    const isConnected = await this.checkConnectivity();
    
    if (isConnected) {
      try {
        const response = await axios.post(`${NARRATIVE_API}/crop-story`, cropData, {
          timeout: 5000 // 5 second timeout
        });
        
        const story = response.data.story;
        this.saveToCache(cacheKey, story);
        
        return {
          data: story,
          source: 'live',
          timestamp: Date.now()
        };
      } catch (error) {
        console.error('Error generating crop story:', error);
        // Fall back to mock data
        return this.getMockData(cropData.cropType, 'cropStory');
      }
    } else {
      // API not available, use mock data
      return this.getMockData(cropData.cropType, 'cropStory');
    }
  },

  /**
   * Generate environmental impact narrative
   * @param cropData - Data about the crop
   * @returns Promise with the generated narrative and source information
   */
  async generateEnvironmentalImpact(cropData: CropData): Promise<NarrativeResponse> {
    const cacheKey = `environmentalImpact_${cropData.cropType}_${cropData.farmLocation || 'unknown'}`;
    
    // Try to get from cache first
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // Check API connectivity
    const isConnected = await this.checkConnectivity();
    
    if (isConnected) {
      try {
        const response = await axios.post(`${NARRATIVE_API}/environmental-impact`, cropData, {
          timeout: 5000 // 5 second timeout
        });
        
        const narrative = response.data.narrative;
        this.saveToCache(cacheKey, narrative);
        
        return {
          data: narrative,
          source: 'live',
          timestamp: Date.now()
        };
      } catch (error) {
        console.error('Error generating environmental impact:', error);
        // Fall back to mock data
        return this.getMockData(cropData.cropType, 'environmentalImpact');
      }
    } else {
      // API not available, use mock data
      return this.getMockData(cropData.cropType, 'environmentalImpact');
    }
  },

  /**
   * Generate cooking suggestions for a crop
   * @param cropData - Data about the crop
   * @returns Promise with the generated suggestions and source information
   */
  async generateCookingSuggestions(cropData: CropData): Promise<NarrativeResponse> {
    const cacheKey = `cookingSuggestions_${cropData.cropType}`;
    
    // Try to get from cache first
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // Check API connectivity
    const isConnected = await this.checkConnectivity();
    
    if (isConnected) {
      try {
        const response = await axios.post(`${NARRATIVE_API}/cooking-suggestions`, cropData, {
          timeout: 5000 // 5 second timeout
        });
        
        const suggestions = response.data.suggestions;
        this.saveToCache(cacheKey, suggestions);
        
        return {
          data: suggestions,
          source: 'live',
          timestamp: Date.now()
        };
      } catch (error) {
        console.error('Error generating cooking suggestions:', error);
        // Fall back to mock data
        return this.getMockData(cropData.cropType, 'cookingSuggestions');
      }
    } else {
      // API not available, use mock data
      return this.getMockData(cropData.cropType, 'cookingSuggestions');
    }
  }
};

export default narrativeService;