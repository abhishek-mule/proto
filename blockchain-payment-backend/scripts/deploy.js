const hre = require("hardhat");

async function main() {
  // Get the contract factories
  const CropNFT = await hre.ethers.getContractFactory("CropNFT");
  const PaymentContract = await hre.ethers.getContractFactory("PaymentContract");

  // Deploy the CropNFT contract first
  const cropNFT = await CropNFT.deploy();
  await cropNFT.deployed();

  console.log(`CropNFT deployed to: ${cropNFT.address}`);

  // Deploy the PaymentContract, passing the address of the CropNFT contract
  const paymentContract = await PaymentContract.deploy(cropNFT.address);
  await paymentContract.deployed();

  console.log(`PaymentContract deployed to: ${paymentContract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});