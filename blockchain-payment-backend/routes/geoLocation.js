const express = require('express');
const router = express.Router();
const { GeoLocationService } = require('../services/geoLocationService');
const geoLocationService = new GeoLocationService();

/**
 * @route   POST /api/geo-location
 * @desc    Add a new location entry
 * @access  Private
 */
router.post('/', async (req, res) => {
  try {
    const locationData = req.body;
    
    if (!locationData.tokenId || !locationData.coordinates || !locationData.stage) {
      return res.status(400).json({
        success: false,
        message: 'Missing required location data'
      });
    }
    
    const location = await geoLocationService.addLocation(locationData);
    
    res.status(201).json({
      success: true,
      location
    });
  } catch (error) {
    console.error('Error adding location:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/geo-location/token/:tokenId
 * @desc    Get location history for a token
 * @access  Public
 */
router.get('/token/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;
    const locations = await geoLocationService.getLocationHistory(tokenId);
    
    res.status(200).json({
      success: true,
      count: locations.length,
      locations
    });
  } catch (error) {
    console.error('Error getting location history:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/geo-location/current/:tokenId
 * @desc    Get current location for a token
 * @access  Public
 */
router.get('/current/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;
    const location = await geoLocationService.getCurrentLocation(tokenId);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'No location found for this token'
      });
    }
    
    res.status(200).json({
      success: true,
      location
    });
  } catch (error) {
    console.error('Error getting current location:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/geo-location/nearby
 * @desc    Find nearby locations
 * @access  Public
 */
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }
    
    const locations = await geoLocationService.findNearbyLocations(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : 10
    );
    
    res.status(200).json({
      success: true,
      count: locations.length,
      locations
    });
  } catch (error) {
    console.error('Error finding nearby locations:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/geo-location/stats
 * @desc    Get location statistics
 * @access  Public
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await geoLocationService.getLocationStats();
    
    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error getting location stats:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;