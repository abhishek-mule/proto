const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { ethers } = require('ethers');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Initialize provider (using Polygon Amoy testnet)
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'https://rpc-amoy.polygon.technology');

// Get wallet balance
router.get('/balance/:address', [
  param('address').custom((value) => {
    if (!ethers.isAddress(value)) {
      throw new Error('Invalid wallet address');
    }
    return true;
  }),
], handleValidationErrors, authenticateToken, async (req, res) => {
  try {
    const { address } = req.params;

    const balance = await provider.getBalance(address);
    const balanceInEth = ethers.formatEther(balance);

    res.json({
      address,
      balance: balanceInEth,
      balanceWei: balance.toString(),
    });
  } catch (error) {
    console.error('Balance check error:', error);
    res.status(500).json({ message: 'Failed to get balance' });
  }
});

// Send transaction
router.post('/send', [
  body('to').custom((value) => {
    if (!ethers.isAddress(value)) {
      throw new Error('Invalid recipient address');
    }
    return true;
  }),
  body('amount').isFloat({ min: 0.000000000000000001 }), // Minimum 1 wei in ETH
], handleValidationErrors, authenticateToken, async (req, res) => {
  try {
    const { to, amount } = req.body;

    // Check if user has a wallet address
    if (!req.user.walletAddress) {
      return res.status(400).json({ message: 'User must have a wallet address to send transactions' });
    }

    // Create wallet instance (in production, you'd use a more secure method)
    if (!process.env.PRIVATE_KEY) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Convert amount to wei
    const amountInWei = ethers.parseEther(amount.toString());

    // Check sender balance
    const balance = await provider.getBalance(wallet.address);
    if (balance < amountInWei) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Estimate gas
    const gasEstimate = await provider.estimateGas({
      to,
      value: amountInWei,
    });

    // Get gas price
    const gasPrice = await provider.getFeeData();

    // Calculate total cost
    const totalCost = amountInWei + (gasEstimate * gasPrice.gasPrice);

    if (balance < totalCost) {
      return res.status(400).json({ message: 'Insufficient balance for transaction and gas' });
    }

    // Send transaction
    const tx = await wallet.sendTransaction({
      to,
      value: amountInWei,
      gasLimit: gasEstimate,
    });

    // Wait for transaction to be mined
    const receipt = await tx.wait();

    res.json({
      transactionHash: tx.hash,
      from: wallet.address,
      to,
      amount: amount.toString(),
      gasUsed: receipt.gasUsed.toString(),
      blockNumber: receipt.blockNumber,
      status: receipt.status === 1 ? 'success' : 'failed',
    });
  } catch (error) {
    console.error('Send transaction error:', error);
    res.status(500).json({ message: 'Failed to send transaction' });
  }
});

// Get transaction details
router.get('/transaction/:txHash', [
  param('txHash').matches(/^0x[a-fA-F0-9]{64}$/),
], handleValidationErrors, authenticateToken, async (req, res) => {
  try {
    const { txHash } = req.params;

    // Get transaction
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Get transaction receipt
    const receipt = await provider.getTransactionReceipt(txHash);

    const transactionDetails = {
      hash: tx.hash,
      blockNumber: tx.blockNumber,
      from: tx.from,
      to: tx.to,
      value: ethers.formatEther(tx.value),
      valueWei: tx.value.toString(),
      gasPrice: tx.gasPrice ? ethers.formatUnits(tx.gasPrice, 'gwei') : null,
      gasLimit: tx.gasLimit.toString(),
      nonce: tx.nonce,
      data: tx.data,
      chainId: tx.chainId,
    };

    if (receipt) {
      transactionDetails.receipt = {
        status: receipt.status === 1 ? 'success' : 'failed',
        gasUsed: receipt.gasUsed.toString(),
        effectiveGasPrice: receipt.effectiveGasPrice ? ethers.formatUnits(receipt.effectiveGasPrice, 'gwei') : null,
        logs: receipt.logs,
      };
    }

    res.json(transactionDetails);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ message: 'Failed to get transaction details' });
  }
});

// Estimate gas for transaction
router.post('/estimate-gas', [
  body('to').custom((value) => {
    if (!ethers.isAddress(value)) {
      throw new Error('Invalid recipient address');
    }
    return true;
  }),
  body('amount').isFloat({ min: 0 }),
], handleValidationErrors, authenticateToken, async (req, res) => {
  try {
    const { to, amount } = req.body;

    // Convert amount to wei
    const amountInWei = ethers.parseEther(amount.toString());

    // Estimate gas
    const gasEstimate = await provider.estimateGas({
      to,
      value: amountInWei,
    });

    // Get current gas price
    const feeData = await provider.getFeeData();

    // Calculate estimated cost
    const estimatedCostWei = gasEstimate * feeData.gasPrice;
    const estimatedCostEth = ethers.formatEther(estimatedCostWei);

    res.json({
      gasEstimate: gasEstimate.toString(),
      gasPrice: {
        wei: feeData.gasPrice.toString(),
        gwei: ethers.formatUnits(feeData.gasPrice, 'gwei'),
      },
      estimatedCost: {
        wei: estimatedCostWei.toString(),
        eth: estimatedCostEth,
      },
      maxFeePerGas: feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, 'gwei') : null,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ? ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei') : null,
    });
  } catch (error) {
    console.error('Gas estimation error:', error);
    res.status(500).json({ message: 'Failed to estimate gas' });
  }
});

module.exports = router;