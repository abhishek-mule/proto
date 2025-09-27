const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  if (!process.env.PRIVATE_KEY || !String(process.env.PRIVATE_KEY).trim()) {
    console.error("PRIVATE_KEY env var is not set. Set it in your shell and retry.");
    process.exit(1);
  }

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, ethers.provider);
  const address = await wallet.getAddress();
  const balanceWei = await ethers.provider.getBalance(address);
  const balance = ethers.formatEther(balanceWei);

  console.log(JSON.stringify({
    network: hre.network.name,
    rpcUrl: hre.network.config.url,
    address,
    balanceMATIC: balance
  }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});