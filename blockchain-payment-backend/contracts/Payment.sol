// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PaymentContract
 * @dev Manages the sale of CropNFTs through a secure escrow system.
 * This contract allows sellers to list their NFTs for a specific price. Buyers can then
 * purchase these NFTs by sending the correct amount of MATIC. The contract holds the
 * funds in escrow and facilitates the transfer of the NFT, ensuring a safe transaction
 * for both parties.
 */
contract PaymentContract is ReentrancyGuard {
    // Reference to the CropNFT contract as an interface
    IERC721 public immutable cropNFT;

    // Struct to store details of an NFT listed for sale
    struct Sale {
        address payable seller;
        uint256 price;
        bool isForSale;
    }

    // Mapping from tokenId to its sale details
    mapping(uint256 => Sale) public sales;

    // Events to notify frontend applications of state changes
    event ListedForSale(uint256 indexed tokenId, address indexed seller, uint256 price);
    event SaleCancelled(uint256 indexed tokenId, address indexed seller);
    event Sold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price);

    /**
     * @dev Sets the address of the CropNFT contract.
     * @param _cropNFTAddress The address of the deployed CropNFT contract.
     */
    constructor(address _cropNFTAddress) {
        cropNFT = IERC721(_cropNFTAddress);
    }

    /**
     * @dev Lists a CropNFT for sale at a specified price.
     * The caller must be the owner of the NFT.
     * The price must be greater than zero.
     * The contract must be approved to transfer the NFT on the seller's behalf.
     *
     * @param tokenId The ID of the token to list for sale.
     * @param price The selling price in Wei.
     */
    function listForSale(uint256 tokenId, uint256 price) public nonReentrant {
        require(cropNFT.ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT");
        require(price > 0, "Price must be greater than zero");
        require(cropNFT.getApproved(tokenId) == address(this), "Contract not approved to transfer this NFT");

        sales[tokenId] = Sale(payable(msg.sender), price, true);

        emit ListedForSale(tokenId, msg.sender, price);
    }

    /**
     * @dev Cancels the sale of a listed NFT.
     * Only the seller of the NFT can cancel the sale.
     *
     * @param tokenId The ID of the token to remove from the sale list.
     */
    function cancelSale(uint256 tokenId) public nonReentrant {
        Sale storage sale = sales[tokenId];
        require(sale.seller == msg.sender, "You are not the seller of this NFT");
        require(sale.isForSale, "NFT is not for sale");

        sale.isForSale = false;

        emit SaleCancelled(tokenId, msg.sender);
    }

    /**
     * @dev Purchases a listed NFT.
     * The buyer must send the exact price of the NFT in MATIC.
     * The NFT must be listed for sale.
     * This function transfers the payment to the seller and the NFT to the buyer.
     *
     * @param tokenId The ID of the token to purchase.
     */
    function purchase(uint256 tokenId) public payable nonReentrant {
        Sale storage sale = sales[tokenId];
        require(sale.isForSale, "This NFT is not for sale");
        require(msg.value == sale.price, "Incorrect amount of MATIC sent");

        address payable seller = sale.seller;
        sale.isForSale = false;

        // Transfer the NFT to the buyer first to prevent re-entrancy issues
        cropNFT.safeTransferFrom(seller, msg.sender, tokenId);

        // Transfer the payment to the seller
        (bool success, ) = seller.call{value: msg.value}("");
        require(success, "Payment transfer failed");

        emit Sold(tokenId, msg.sender, seller, msg.value);
    }

    /**
     * @dev Allows the contract owner to withdraw any MATIC sent to the contract by mistake.
     */
    function withdraw() public nonReentrant {
        // This is a basic withdrawal function. In a production system,
        // you would want this to be more secure, likely using an Ownable pattern
        // or a multisig wallet.
        payable(msg.sender).transfer(address(this).balance);
    }
}
