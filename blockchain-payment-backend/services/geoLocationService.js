const mongoose = require('mongoose');

// Define schema for geo-location tracking
const GeoLocationSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
    index: true
  },
  locationName: {
    type: String,
    required: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  stage: {
    type: String,
    enum: ['PLANTING', 'GROWING', 'HARVESTING', 'PROCESSING', 'PACKAGING', 'DISTRIBUTION', 'RETAIL'],
    required: true
  },
  description: {
    type: String
  },
  verifiedBy: {
    type: String
  },
  metadata: {
    type: Map,
    of: String
  }
});

// Create model
const GeoLocation = mongoose.model('GeoLocation', GeoLocationSchema);

class GeoLocationService {
  /**
   * Add a new location entry for a token
   * @param {Object} locationData - Location data to add
   * @returns {Promise<Object>} Created location entry
   */
  async addLocation(locationData) {
    try {
      const location = new GeoLocation(locationData);
      await location.save();
      return location;
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  }

  /**
   * Get location history for a specific token
   * @param {String} tokenId - NFT token ID
   * @returns {Promise<Array>} Array of location entries
   */
  async getLocationHistory(tokenId) {
    try {
      return await GeoLocation.find({ tokenId }).sort({ timestamp: 1 });
    } catch (error) {
      console.error('Error getting location history:', error);
      throw error;
    }
  }

  /**
   * Get the current location for a token
   * @param {String} tokenId - NFT token ID
   * @returns {Promise<Object>} Latest location entry
   */
  async getCurrentLocation(tokenId) {
    try {
      return await GeoLocation.findOne({ tokenId }).sort({ timestamp: -1 });
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  }

  /**
   * Get all locations for a specific supply chain stage
   * @param {String} stage - Supply chain stage
   * @returns {Promise<Array>} Array of location entries
   */
  async getLocationsByStage(stage) {
    try {
      return await GeoLocation.find({ stage }).sort({ timestamp: -1 });
    } catch (error) {
      console.error('Error getting locations by stage:', error);
      throw error;
    }
  }

  /**
   * Search for locations within a radius
   * @param {Number} lat - Latitude
   * @param {Number} lng - Longitude
   * @param {Number} radiusKm - Radius in kilometers
   * @returns {Promise<Array>} Array of nearby locations
   */
  async findNearbyLocations(lat, lng, radiusKm = 10) {
    try {
      // Convert km to degrees (approximate)
      const radiusDegrees = radiusKm / 111;
      
      // Simple radius search (not using geospatial queries for simplicity)
      return await GeoLocation.find({
        'coordinates.latitude': { $gte: lat - radiusDegrees, $lte: lat + radiusDegrees },
        'coordinates.longitude': { $gte: lng - radiusDegrees, $lte: lng + radiusDegrees }
      }).sort({ timestamp: -1 });
    } catch (error) {
      console.error('Error finding nearby locations:', error);
      throw error;
    }
  }

  /**
   * Update location information
   * @param {String} locationId - Location ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated location
   */
  async updateLocation(locationId, updateData) {
    try {
      return await GeoLocation.findByIdAndUpdate(
        locationId,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  }

  /**
   * Delete a location entry
   * @param {String} locationId - Location ID
   * @returns {Promise<Boolean>} Success status
   */
  async deleteLocation(locationId) {
    try {
      const result = await GeoLocation.findByIdAndDelete(locationId);
      return !!result;
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    }
  }

  /**
   * Get statistics about locations
   * @returns {Promise<Object>} Location statistics
   */
  async getLocationStats() {
    try {
      const totalLocations = await GeoLocation.countDocuments();
      const stageStats = await GeoLocation.aggregate([
        { $group: { _id: '$stage', count: { $sum: 1 } } }
      ]);
      
      const tokenStats = await GeoLocation.aggregate([
        { $group: { _id: '$tokenId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);
      
      return {
        totalLocations,
        stageStats,
        topTokensByLocations: tokenStats
      };
    } catch (error) {
      console.error('Error getting location stats:', error);
      throw error;
    }
  }
}

module.exports = { GeoLocationService, GeoLocation };