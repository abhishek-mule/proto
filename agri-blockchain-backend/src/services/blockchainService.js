const Web3 = require('web3');
const { ethers } = require('ethers');

class BlockchainService {
  constructor() {
    this.networks = {
      ethereum: {
        name: 'Ethereum Mainnet',
        rpcUrl: process.env.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
        blockExplorer: 'https://etherscan.io'
      },
      polygon: {
        name: 'Polygon Mainnet',
        rpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
        blockExplorer: 'https://polygonscan.com'
      },
      polygonMumbai: {
        name: 'Polygon Mumbai',
        rpcUrl: process.env.POLYGON_TESTNET_RPC_URL || 'https://rpc-mumbai.maticvigil.com', // Replace with a valid URL
        blockExplorer: 'https://mumbai.polygonscan.com'
      }
    };

    this.web3 = new Web3(this.networks.ethereum.rpcUrl);
    this.ethersProvider = new ethers.providers.JsonRpcProvider(this.networks.ethereum.rpcUrl);
  }

  async getNetworkStatus(networkName) {
    const network = this.networks[networkName.toLowerCase()];
    if (!network) {
      throw new Error(`Network ${networkName} not supported`);
    }

    try {
      const response = await fetch(network.rpcUrl);
      if (response.ok) {
        return { status: 'online', network };
      } else {
        return { status: 'offline', network };
      }
    } catch (error) {
      return { status: 'error', network, error: error.message };
    }
  }

  async getBlockNumber(networkName) {
    const network = this.networks[networkName.toLowerCase()];
    if (!network) {
      throw new Error(`Network ${networkName} not supported`);
    }

    try {
      const blockNumber = await this.web3.eth.getBlockNumber();
      return { network, blockNumber };
    } catch (error) {
      throw new Error(`Failed to get block number for ${network.name}: ${error.message}`);
    }
  }
}

module.exports = new BlockchainService();