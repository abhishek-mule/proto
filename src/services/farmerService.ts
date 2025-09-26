import axios from 'axios';
import { apiConfig } from '../apiConfig';

const FARMER_API_URL = `${apiConfig.agriBlockchain}/farmer`;

/**
 * Fetches the NFTs owned by the currently authenticated farmer.
 * @returns {Promise<any>} The list of owned NFTs.
 */
export const getOwnedNfts = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${FARMER_API_URL}/nfts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Mints a new NFT for a crop.
 * @param {any} nftData - The data for the new NFT.
 * @returns {Promise<any>} The response from the API.
 */
export const mintNft = async (nftData: any) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${FARMER_API_URL}/mint`, nftData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
