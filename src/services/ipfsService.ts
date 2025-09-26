import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const IPFS_API = `${API_BASE_URL}/api/ipfs`;

export interface IPFSFile {
  cid: string;
  name: string;
  size: number;
  url: string;
}

export interface IPFSMetadata {
  cid: string;
  metadata: Record<string, any>;
}

/**
 * Service for interacting with IPFS through the backend API
 */
const ipfsService = {
  /**
   * Upload a file to IPFS
   * @param file - File to upload
   * @returns Promise with IPFS file data
   */
  async uploadFile(file: File): Promise<IPFSFile> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${IPFS_API}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.file;
  },

  /**
   * Upload metadata to IPFS
   * @param metadata - Metadata object to upload
   * @returns Promise with IPFS metadata
   */
  async uploadMetadata(metadata: Record<string, any>): Promise<IPFSMetadata> {
    const response = await axios.post(`${IPFS_API}/metadata`, { metadata });
    return response.data;
  },

  /**
   * Create NFT metadata with image and attributes
   * @param name - NFT name
   * @param description - NFT description
   * @param imageCid - CID of the uploaded image
   * @param attributes - NFT attributes
   * @returns Promise with IPFS metadata
   */
  async createNFTMetadata(
    name: string,
    description: string,
    imageCid: string,
    attributes: Record<string, any>[]
  ): Promise<IPFSMetadata> {
    const metadata = {
      name,
      description,
      image: `ipfs://${imageCid}`,
      attributes,
    };

    const response = await axios.post(`${IPFS_API}/nft-metadata`, { metadata });
    return response.data;
  },

  /**
   * Get metadata from IPFS by CID
   * @param cid - Content identifier
   * @returns Promise with metadata
   */
  async getMetadata(cid: string): Promise<Record<string, any>> {
    const response = await axios.get(`${IPFS_API}/metadata/${cid}`);
    return response.data.metadata;
  },

  /**
   * Get gateway URL for an IPFS CID
   * @param cid - Content identifier
   * @returns Gateway URL
   */
  getGatewayUrl(cid: string): string {
    return `https://ipfs.io/ipfs/${cid}`;
  }
};

export default ipfsService;