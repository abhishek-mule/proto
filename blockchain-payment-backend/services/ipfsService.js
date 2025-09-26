const { create } = require('ipfs-http-client');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

class IPFSService {
    constructor() {
        // Initialize IPFS client - can be configured for local node or Infura
        this.ipfs = create({
            host: process.env.IPFS_HOST || 'localhost',
            port: process.env.IPFS_PORT || 5001,
            protocol: process.env.IPFS_PROTOCOL || 'http'
        });
        
        // Alternative: Use Infura IPFS gateway
        if (process.env.INFURA_PROJECT_ID && process.env.INFURA_PROJECT_SECRET) {
            this.ipfs = create({
                host: 'ipfs.infura.io',
                port: 5001,
                protocol: 'https',
                headers: {
                    authorization: `Basic ${Buffer.from(
                        `${process.env.INFURA_PROJECT_ID}:${process.env.INFURA_PROJECT_SECRET}`
                    ).toString('base64')}`
                }
            });
        }
    }

    /**
     * Upload a file to IPFS
     * @param {Buffer|string} content - File content or file path
     * @param {string} filename - Name of the file
     * @returns {Promise<string>} IPFS hash
     */
    async uploadFile(content, filename) {
        try {
            let fileContent;
            
            if (typeof content === 'string') {
                // If content is a file path, read the file
                fileContent = fs.readFileSync(content);
            } else {
                // If content is already a buffer
                fileContent = content;
            }

            const result = await this.ipfs.add({
                path: filename,
                content: fileContent
            });

            console.log(`File uploaded to IPFS: ${result.cid.toString()}`);
            return result.cid.toString();
        } catch (error) {
            console.error('Error uploading file to IPFS:', error);
            throw new Error(`Failed to upload file to IPFS: ${error.message}`);
        }
    }

    /**
     * Upload crop metadata to IPFS
     * @param {Object} metadata - Crop metadata object
     * @returns {Promise<string>} IPFS hash
     */
    async uploadMetadata(metadata) {
        try {
            const metadataString = JSON.stringify(metadata, null, 2);
            const result = await this.ipfs.add({
                path: `metadata-${Date.now()}.json`,
                content: Buffer.from(metadataString)
            });

            console.log(`Metadata uploaded to IPFS: ${result.cid.toString()}`);
            return result.cid.toString();
        } catch (error) {
            console.error('Error uploading metadata to IPFS:', error);
            throw new Error(`Failed to upload metadata to IPFS: ${error.message}`);
        }
    }

    /**
     * Create comprehensive crop NFT metadata
     * @param {Object} cropData - Crop information
     * @param {string} imageHash - IPFS hash of the crop image
     * @returns {Object} NFT metadata following ERC721 standard
     */
    createNFTMetadata(cropData, imageHash) {
        const metadata = {
            name: `${cropData.cropType} - ${cropData.variety}`,
            description: `Agricultural NFT representing ${cropData.quantity}g of ${cropData.variety} ${cropData.cropType} grown by verified farmer.`,
            image: `ipfs://${imageHash}`,
            external_url: `${process.env.FRONTEND_URL}/crop/${cropData.tokenId}`,
            attributes: [
                {
                    trait_type: "Crop Type",
                    value: cropData.cropType
                },
                {
                    trait_type: "Variety",
                    value: cropData.variety
                },
                {
                    trait_type: "Farmer",
                    value: cropData.farmerAddress
                },
                {
                    trait_type: "Farm Location",
                    value: cropData.farmLocation
                },
                {
                    trait_type: "Planting Date",
                    display_type: "date",
                    value: cropData.plantingDate
                },
                {
                    trait_type: "Quantity (grams)",
                    display_type: "number",
                    value: cropData.quantity
                },
                {
                    trait_type: "Quality Grade",
                    value: cropData.qualityGrade
                },
                {
                    trait_type: "Certifications",
                    value: cropData.certifications
                },
                {
                    trait_type: "Harvest Status",
                    value: cropData.harvestDate ? "Harvested" : "Growing"
                }
            ],
            properties: {
                crop_data: {
                    planting_coordinates: {
                        latitude: cropData.latitude,
                        longitude: cropData.longitude
                    },
                    supply_chain_events: cropData.supplyChainEvents || [],
                    blockchain_network: process.env.BLOCKCHAIN_NETWORK || "polygon",
                    contract_address: process.env.CROP_NFT_CONTRACT_ADDRESS,
                    verification_status: "verified"
                }
            }
        };

        return metadata;
    }

    /**
     * Upload crop image and create complete NFT metadata
     * @param {Buffer} imageBuffer - Image file buffer
     * @param {Object} cropData - Crop information
     * @returns {Promise<Object>} Object containing image hash and metadata hash
     */
    async uploadCropNFTData(imageBuffer, cropData) {
        try {
            // Upload image to IPFS
            const imageHash = await this.uploadFile(imageBuffer, `crop-${Date.now()}.jpg`);
            
            // Create NFT metadata
            const metadata = this.createNFTMetadata(cropData, imageHash);
            
            // Upload metadata to IPFS
            const metadataHash = await this.uploadMetadata(metadata);
            
            return {
                imageHash,
                metadataHash,
                metadata,
                ipfsImageUrl: `ipfs://${imageHash}`,
                ipfsMetadataUrl: `ipfs://${metadataHash}`,
                gatewayImageUrl: `${process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs'}/${imageHash}`,
                gatewayMetadataUrl: `${process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs'}/${metadataHash}`
            };
        } catch (error) {
            console.error('Error uploading crop NFT data:', error);
            throw new Error(`Failed to upload crop NFT data: ${error.message}`);
        }
    }

    /**
     * Retrieve content from IPFS
     * @param {string} hash - IPFS hash
     * @returns {Promise<Buffer>} File content
     */
    async getFile(hash) {
        try {
            const chunks = [];
            for await (const chunk of this.ipfs.cat(hash)) {
                chunks.push(chunk);
            }
            return Buffer.concat(chunks);
        } catch (error) {
            console.error('Error retrieving file from IPFS:', error);
            throw new Error(`Failed to retrieve file from IPFS: ${error.message}`);
        }
    }

    /**
     * Retrieve and parse JSON metadata from IPFS
     * @param {string} hash - IPFS hash
     * @returns {Promise<Object>} Parsed JSON metadata
     */
    async getMetadata(hash) {
        try {
            const content = await this.getFile(hash);
            return JSON.parse(content.toString());
        } catch (error) {
            console.error('Error retrieving metadata from IPFS:', error);
            throw new Error(`Failed to retrieve metadata from IPFS: ${error.message}`);
        }
    }

    /**
     * Pin content to ensure it stays available
     * @param {string} hash - IPFS hash to pin
     * @returns {Promise<void>}
     */
    async pinContent(hash) {
        try {
            await this.ipfs.pin.add(hash);
            console.log(`Content pinned: ${hash}`);
        } catch (error) {
            console.error('Error pinning content:', error);
            throw new Error(`Failed to pin content: ${error.message}`);
        }
    }

    /**
     * Get IPFS node information
     * @returns {Promise<Object>} Node information
     */
    async getNodeInfo() {
        try {
            const id = await this.ipfs.id();
            return {
                id: id.id,
                publicKey: id.publicKey,
                addresses: id.addresses,
                agentVersion: id.agentVersion,
                protocolVersion: id.protocolVersion
            };
        } catch (error) {
            console.error('Error getting IPFS node info:', error);
            throw new Error(`Failed to get IPFS node info: ${error.message}`);
        }
    }
}

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

module.exports = {
    IPFSService,
    upload
};