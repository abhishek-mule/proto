const express = require('express');
const router = express.Router();
const { IPFSService, upload } = require('../services/ipfsService');
const ipfsService = new IPFSService();

/**
 * @route   POST /api/ipfs/upload
 * @desc    Upload a file to IPFS
 * @access  Private
 */
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const fileBuffer = req.file.buffer;
        const filename = req.file.originalname;
        
        const hash = await ipfsService.uploadFile(fileBuffer, filename);
        
        res.status(200).json({
            success: true,
            hash,
            filename,
            ipfsUrl: `ipfs://${hash}`,
            gatewayUrl: `${process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs'}/${hash}`
        });
    } catch (error) {
        console.error('Error uploading to IPFS:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @route   POST /api/ipfs/metadata
 * @desc    Upload metadata to IPFS
 * @access  Private
 */
router.post('/metadata', async (req, res) => {
    try {
        const metadata = req.body;
        
        if (!metadata) {
            return res.status(400).json({ success: false, message: 'No metadata provided' });
        }
        
        const hash = await ipfsService.uploadMetadata(metadata);
        
        res.status(200).json({
            success: true,
            hash,
            ipfsUrl: `ipfs://${hash}`,
            gatewayUrl: `${process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs'}/${hash}`
        });
    } catch (error) {
        console.error('Error uploading metadata to IPFS:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @route   POST /api/ipfs/crop-nft
 * @desc    Upload crop image and metadata for NFT
 * @access  Private
 */
router.post('/crop-nft', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image uploaded' });
        }
        
        const cropData = JSON.parse(req.body.cropData);
        
        if (!cropData) {
            return res.status(400).json({ success: false, message: 'No crop data provided' });
        }
        
        const result = await ipfsService.uploadCropNFTData(req.file.buffer, cropData);
        
        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Error creating crop NFT data:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @route   GET /api/ipfs/metadata/:hash
 * @desc    Get metadata from IPFS
 * @access  Public
 */
router.get('/metadata/:hash', async (req, res) => {
    try {
        const { hash } = req.params;
        
        if (!hash) {
            return res.status(400).json({ success: false, message: 'No hash provided' });
        }
        
        const metadata = await ipfsService.getMetadata(hash);
        
        res.status(200).json({
            success: true,
            metadata
        });
    } catch (error) {
        console.error('Error retrieving metadata from IPFS:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @route   GET /api/ipfs/node-info
 * @desc    Get IPFS node information
 * @access  Private
 */
router.get('/node-info', async (req, res) => {
    try {
        const nodeInfo = await ipfsService.getNodeInfo();
        
        res.status(200).json({
            success: true,
            nodeInfo
        });
    } catch (error) {
        console.error('Error getting IPFS node info:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;