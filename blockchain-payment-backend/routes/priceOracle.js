const express = require('express');
const router = express.Router();
const PriceOracleService = require('../services/priceOracleService');
const priceOracle = new PriceOracleService();

/**
 * @route   GET /api/price-oracle/crypto
 * @desc    Get crypto prices
 * @access  Public
 */
router.get('/crypto', async (req, res) => {
  try {
    const prices = await priceOracle.getCryptoPrices();
    res.status(200).json({ success: true, prices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/price-oracle/fiat
 * @desc    Get fiat exchange rates
 * @access  Public
 */
router.get('/fiat', async (req, res) => {
  try {
    const rates = await priceOracle.getFiatRates();
    res.status(200).json({ success: true, rates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/price-oracle/convert
 * @desc    Convert between currencies
 * @access  Public
 */
router.get('/convert', async (req, res) => {
  try {
    const { amount, from, to } = req.query;
    
    if (!amount || !from || !to) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameters: amount, from, to' 
      });
    }
    
    const result = await priceOracle.convertCurrency(
      parseFloat(amount), 
      from, 
      to
    );
    
    res.status(200).json({ success: true, conversion: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/price-oracle/token/:symbol
 * @desc    Get token price
 * @access  Public
 */
router.get('/token/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { currency = 'USD' } = req.query;
    
    const price = await priceOracle.getTokenPrice(symbol, currency);
    
    res.status(200).json({ success: true, price });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;