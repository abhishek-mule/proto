import web3Service from '../services/web3Service';

// Connect wallet
const connectWallet = async () => {
  try {
    const account = await web3Service.connectWallet();
    console.log('Connected:', account);
  } catch (error) {
    console.error('Connection failed:', error);
  }
};

// Send transaction
const sendPayment = async (to: string, amount: string) => {
  try {
    const tx = await web3Service.sendTransaction({ to, amount });
    console.log('Transaction sent:', tx.hash);
  } catch (error) {
    console.error('Transaction failed:', error);
  }
};

// Example usage
export const exampleUsage = async () => {
  // Connect wallet first
  await connectWallet();

  // Then send a payment (example addresses)
  const recipientAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'; // Example address
  const amount = '0.01'; // 0.01 ETH

  await sendPayment(recipientAddress, amount);
};

// Additional utility functions
export const getWalletInfo = async () => {
  if (web3Service.isConnected()) {
    const address = web3Service.getCurrentAccount();
    const balance = await web3Service.getBalance();
    console.log('Wallet Address:', address);
    console.log('Balance:', balance, 'ETH');
    return { address, balance };
  } else {
    console.log('Wallet not connected');
    return null;
  }
};

export const signMessage = async (message: string) => {
  try {
    const signature = await web3Service.signMessage(message);
    console.log('Message signed:', signature);
    return signature;
  } catch (error) {
    console.error('Signing failed:', error);
    return null;
  }
};