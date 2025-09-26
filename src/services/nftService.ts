import axios from 'axios';
import { apiConfig } from '../apiConfig';

const NFT_API_URL = `${apiConfig.agriBlockchain}/nfts`;

/**
 * Fetches all NFTs from the marketplace.
 * @returns {Promise<any>} The list of NFTs.
 */
export const getAllNfts = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(NFT_API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
