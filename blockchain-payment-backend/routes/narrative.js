const express = require('express');
const router = express.Router();
const NarrativeService = require('../services/narrativeService');
const narrativeService = new NarrativeService();

/**
 * @route   POST /api/narrative/crop-story
 * @desc    Generate a narrative story for a crop
 * @access  Public
 */
router.post('/crop-story', async (req, res) => {
  try {
    const cropData = req.body;
    
    if (!cropData || !cropData.cropType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing crop data' 
      });
    }
    
    const story = await narrativeService.generateCropStory(cropData);
    
    res.status(200).json({
      success: true,
      story
    });
  } catch (error) {
    console.error('Error generating crop story:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * @route   POST /api/narrative/environmental-impact
 * @desc    Generate environmental impact narrative
 * @access  Public
 */
router.post('/environmental-impact', async (req, res) => {
  try {
    const cropData = req.body;
    
    if (!cropData || !cropData.cropType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing crop data' 
      });
    }
    
    const narrative = await narrativeService.generateEnvironmentalImpact(cropData);
    
    res.status(200).json({
      success: true,
      narrative
    });
  } catch (error) {
    console.error('Error generating environmental impact:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * @route   POST /api/narrative/cooking-suggestions
 * @desc    Generate cooking suggestions
 * @access  Public
 */
router.post('/cooking-suggestions', async (req, res) => {
  try {
    const cropData = req.body;
    
    if (!cropData || !cropData.cropType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing crop data' 
      });
    }
    
    const suggestions = await narrativeService.generateCookingSuggestions(cropData);
    
    res.status(200).json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('Error generating cooking suggestions:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;