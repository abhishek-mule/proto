require("@nomicfoundation/hardhat-toolbox");
const path = require('path');

const normalizePk = (pk) =>
  pk ? (pk.startsWith("0x") ? pk : `0x${pk}`) : undefined;
const accounts = process.env.PRIVATE_KEY ? [normalizePk(process.env.PRIVATE_KEY)] : [];

module.exports = {
  solidity: "0.8.24",
  networks: {
    amoy: {
      url: "https://rpc-amoy.polygon.technology",
      accounts,
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL || "https://polygon-mumbai-bor.publicnode.com",
      accounts,
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
      polygonAmoy: process.env.POLYGONSCAN_API_KEY,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    root: path.resolve(__dirname)
  }
};
