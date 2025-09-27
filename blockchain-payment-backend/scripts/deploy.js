const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const network = hre.network.name;

  // Ensure we have a signer (ethers v6 requires a signer-attached factory)
  const { ethers } = hre;
  const pk = process.env.PRIVATE_KEY;
  if (!pk || !String(pk).trim()) {
    throw new Error('Missing PRIVATE_KEY in environment. Set it and retry.');
  }
  const normalizedPk = pk.startsWith('0x') ? pk : `0x${pk}`;
  const signer = new ethers.Wallet(normalizedPk, ethers.provider);

  // Get the contract factories bound to the signer
  const CropNFT = await ethers.getContractFactory("CropNFT", signer);
  const PaymentContract = await ethers.getContractFactory("PaymentContract", signer);

  // Deploy the CropNFT contract first
  const cropNFT = await CropNFT.deploy();
  await cropNFT.waitForDeployment();
  const cropNFTAddress = await cropNFT.getAddress();

  console.log(`CropNFT deployed to: ${cropNFTAddress}`);

  // Deploy the PaymentContract, passing the address of the CropNFT contract
  const paymentContract = await PaymentContract.deploy(cropNFTAddress);
  await paymentContract.waitForDeployment();
  const paymentAddress = await paymentContract.getAddress();

  console.log(`PaymentContract deployed to: ${paymentAddress}`);

  // Write addresses to a deployments file
  const outDir = path.join(__dirname, "..", "deployments");
  const outPath = path.join(outDir, `deployments-${network}.json`);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const data = {
    network,
    timestamp: new Date().toISOString(),
    cropNFT: cropNFTAddress,
    paymentContract: paymentAddress
  };
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
  console.log(`\nSaved deployment info to: ${outPath}`);

  // Helpful outputs to update environment variables
  console.log("\nAdd these to your environment:");
  console.log(`CROP_NFT_CONTRACT_ADDRESS=${cropNFTAddress}`);
  console.log(`CONTRACT_ADDRESS=${paymentAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
