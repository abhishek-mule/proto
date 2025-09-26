// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title CropNFT
 * @dev A comprehensive smart contract for creating and managing agricultural crop NFTs with full traceability.
 * This contract provides immutable on-chain data storage for the complete farm-to-table journey.
 * Features include supply chain tracking, geo-location data, quality certifications, and ownership history.
 */
contract CropNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Enums for crop lifecycle stages
    enum CropStage { Planted, Growing, Harvested, Processed, Packaged, InTransit, Delivered, Sold }
    enum QualityGrade { A, B, C, Organic, Premium }

    // Struct for geo-location data
    struct GeoLocation {
        int256 latitude;   // Stored as fixed-point (multiply by 1e6)
        int256 longitude;  // Stored as fixed-point (multiply by 1e6)
        string locationName;
        uint256 timestamp;
    }

    // Struct for supply chain tracking
    struct SupplyChainEvent {
        CropStage stage;
        address actor;
        string description;
        uint256 timestamp;
        string ipfsHash; // For storing images/documents
        GeoLocation location;
    }

    // Struct for crop metadata
    struct CropData {
        string cropType;
        string variety;
        uint256 plantingDate;
        uint256 harvestDate;
        address farmer;
        QualityGrade grade;
        uint256 quantity; // in grams
        string certifications; // Organic, Fair Trade, etc.
        bool isActive;
    }

    // Mappings for traceability data
    mapping(uint256 => CropData) public cropData;
    mapping(uint256 => SupplyChainEvent[]) public supplyChainHistory;
    mapping(uint256 => mapping(address => bool)) public authorizedActors;
    mapping(address => bool) public verifiedFarmers;
    mapping(address => bool) public certifiedProcessors;

    // Events for transparency
    event CropMinted(uint256 indexed tokenId, address indexed farmer, string cropType);
    event SupplyChainUpdated(uint256 indexed tokenId, CropStage stage, address indexed actor);
    event QualityGraded(uint256 indexed tokenId, QualityGrade grade, address indexed grader);
    event LocationUpdated(uint256 indexed tokenId, int256 latitude, int256 longitude);
    event FarmerVerified(address indexed farmer, bool verified);
    event ProcessorCertified(address indexed processor, bool certified);

    /**
     * @dev Initializes the contract, setting the name, symbol, and owner.
     */
    constructor() ERC721("CropNFT", "CNFT") Ownable(msg.sender) {}

    // Modifiers
    modifier onlyVerifiedFarmer() {
        require(verifiedFarmers[msg.sender], "Only verified farmers can perform this action");
        _;
    }

    modifier onlyAuthorizedActor(uint256 tokenId) {
        require(
            authorizedActors[tokenId][msg.sender] || 
            msg.sender == owner() || 
            msg.sender == cropData[tokenId].farmer,
            "Not authorized to update this crop"
        );
        _;
    }

    /**
     * @dev Mints a new Crop NFT with comprehensive traceability data.
     * @param farmer The farmer's address who will own the NFT.
     * @param uri The URI string that points to the NFT's metadata (IPFS hash).
     * @param cropType The type of crop (e.g., "Tomato", "Rice").
     * @param variety The specific variety of the crop.
     * @param plantingDate The timestamp when the crop was planted.
     * @param latitude The latitude of the farm (multiplied by 1e6).
     * @param longitude The longitude of the farm (multiplied by 1e6).
     * @param locationName The name of the farm location.
     * @param quantity The quantity of the crop in grams.
     * @param certifications Any certifications (e.g., "Organic,Fair Trade").
     * @return The ID of the newly minted token.
     */
    function mintCropNFT(
        address farmer,
        string memory uri,
        string memory cropType,
        string memory variety,
        uint256 plantingDate,
        int256 latitude,
        int256 longitude,
        string memory locationName,
        uint256 quantity,
        string memory certifications
    ) public onlyOwner returns (uint256) {
        require(verifiedFarmers[farmer], "Farmer must be verified");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Mint the NFT
        _safeMint(farmer, tokenId);
        _setTokenURI(tokenId, uri);
        
        // Set crop data
        cropData[tokenId] = CropData({
            cropType: cropType,
            variety: variety,
            plantingDate: plantingDate,
            harvestDate: 0,
            farmer: farmer,
            grade: QualityGrade.A, // Default grade
            quantity: quantity,
            certifications: certifications,
            isActive: true
        });
        
        // Add initial supply chain event
        GeoLocation memory farmLocation = GeoLocation({
            latitude: latitude,
            longitude: longitude,
            locationName: locationName,
            timestamp: block.timestamp
        });
        
        supplyChainHistory[tokenId].push(SupplyChainEvent({
            stage: CropStage.Planted,
            actor: farmer,
            description: "Crop planted",
            timestamp: plantingDate,
            ipfsHash: uri,
            location: farmLocation
        }));
        
        // Authorize farmer to update this crop
        authorizedActors[tokenId][farmer] = true;
        
        emit CropMinted(tokenId, farmer, cropType);
        emit SupplyChainUpdated(tokenId, CropStage.Planted, farmer);
        emit LocationUpdated(tokenId, latitude, longitude);
        
        return tokenId;
    }

    /**
     * @dev Updates the supply chain with a new event.
     */
    function updateSupplyChain(
        uint256 tokenId,
        CropStage stage,
        string memory description,
        string memory ipfsHash,
        int256 latitude,
        int256 longitude,
        string memory locationName
    ) public onlyAuthorizedActor(tokenId) {
        require(cropData[tokenId].isActive, "Crop NFT is not active");
        
        GeoLocation memory location = GeoLocation({
            latitude: latitude,
            longitude: longitude,
            locationName: locationName,
            timestamp: block.timestamp
        });
        
        supplyChainHistory[tokenId].push(SupplyChainEvent({
            stage: stage,
            actor: msg.sender,
            description: description,
            timestamp: block.timestamp,
            ipfsHash: ipfsHash,
            location: location
        }));
        
        // Update harvest date if harvested
        if (stage == CropStage.Harvested && cropData[tokenId].harvestDate == 0) {
            cropData[tokenId].harvestDate = block.timestamp;
        }
        
        emit SupplyChainUpdated(tokenId, stage, msg.sender);
        emit LocationUpdated(tokenId, latitude, longitude);
    }

    /**
     * @dev Sets the quality grade for a crop.
     */
    function setQualityGrade(uint256 tokenId, QualityGrade grade) 
        public onlyAuthorizedActor(tokenId) {
        cropData[tokenId].grade = grade;
        emit QualityGraded(tokenId, grade, msg.sender);
    }

    /**
     * @dev Verifies a farmer.
     */
    function verifyFarmer(address farmer, bool verified) public onlyOwner {
        verifiedFarmers[farmer] = verified;
        emit FarmerVerified(farmer, verified);
    }

    /**
     * @dev Certifies a processor.
     */
    function certifyProcessor(address processor, bool certified) public onlyOwner {
        certifiedProcessors[processor] = certified;
        emit ProcessorCertified(processor, certified);
    }

    /**
     * @dev Authorizes an actor to update a specific crop's supply chain.
     */
    function authorizeActor(uint256 tokenId, address actor, bool authorized) 
        public onlyAuthorizedActor(tokenId) {
        authorizedActors[tokenId][actor] = authorized;
    }

    /**
     * @dev Gets the complete supply chain history for a crop.
     */
    function getSupplyChainHistory(uint256 tokenId) 
        public view returns (SupplyChainEvent[] memory) {
        return supplyChainHistory[tokenId];
    }

    /**
     * @dev Gets the current location of a crop (latest supply chain event).
     */
    function getCurrentLocation(uint256 tokenId) 
        public view returns (GeoLocation memory) {
        require(supplyChainHistory[tokenId].length > 0, "No supply chain history");
        uint256 lastIndex = supplyChainHistory[tokenId].length - 1;
        return supplyChainHistory[tokenId][lastIndex].location;
    }

    /**
     * @dev Gets crop data for a token.
     */
    function getCropData(uint256 tokenId) public view returns (CropData memory) {
        return cropData[tokenId];
    }

    /**
     * @dev Legacy mint function for backward compatibility.
     */
    function safeMint(address to, string memory uri)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
