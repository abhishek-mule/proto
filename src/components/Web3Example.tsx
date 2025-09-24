import React, { useState, useEffect } from 'react';
import web3Service from '../services/web3Service';
import { Web3Account, TransactionResponse, Web3Event } from '../types/web3';

const Web3Example: React.FC = () => {
  const [account, setAccount] = useState<Web3Account | null>(null);
  const [balance, setBalance] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [lastTx, setLastTx] = useState<TransactionResponse | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Check if already connected
    if (web3Service.isConnected()) {
      const currentAccount = web3Service.getCurrentAccount();
      if (currentAccount) {
        updateAccountInfo(currentAccount);
      }
    }

    // Set up event listeners
    const handleAccountsChanged = (event: Web3Event) => {
      console.log('Accounts changed:', event.data);
      if (event.data?.accounts?.[0]) {
        updateAccountInfo(event.data.accounts[0]);
      } else {
        setAccount(null);
        setBalance('');
      }
    };

    const handleChainChanged = (event: Web3Event) => {
      console.log('Chain changed:', event.data);
      // Page will reload automatically
    };

    const handleDisconnect = () => {
      console.log('Wallet disconnected');
      setAccount(null);
      setBalance('');
    };

    web3Service.on('accountsChanged', handleAccountsChanged);
    web3Service.on('chainChanged', handleChainChanged);
    web3Service.on('disconnect', handleDisconnect);

    return () => {
      web3Service.off('accountsChanged', handleAccountsChanged);
      web3Service.off('chainChanged', handleChainChanged);
      web3Service.off('disconnect', handleDisconnect);
    };
  }, []);

  const updateAccountInfo = async (address: string) => {
    try {
      const balance = await web3Service.getBalance(address);
      setAccount({
        address,
        chainId: '0x1', // Will be updated when we get network info
        balance,
      });
      setBalance(balance);
    } catch (err) {
      console.error('Failed to update account info:', err);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    setError('');

    try {
      const account = await web3Service.connectWallet();
      setAccount(account);
      setBalance(account.balance || '');
      console.log('Connected:', account);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to connect wallet';
      setError(message);
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const sendPayment = async (to: string, amount: string) => {
    if (!account) return;

    setIsSending(true);
    setError('');

    try {
      const tx = await web3Service.sendTransaction({ to, amount });
      setLastTx(tx);
      console.log('Transaction sent:', tx.hash);

      // Update balance after transaction
      setTimeout(async () => {
        try {
          const newBalance = await web3Service.getBalance(account.address);
          setBalance(newBalance);
        } catch (err) {
          console.error('Failed to update balance:', err);
        }
      }, 2000);

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send transaction';
      setError(message);
      console.error('Transaction failed:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendTestPayment = () => {
    // Send a small test payment to yourself
    if (account) {
      sendPayment(account.address, '0.001');
    }
  };

  const disconnectWallet = async () => {
    try {
      await web3Service.disconnectWallet();
      setAccount(null);
      setBalance('');
      setLastTx(null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to disconnect wallet';
      setError(message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Web3 Wallet Connection</h2>

      {!web3Service.isMetaMaskInstalled() && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          MetaMask is not installed. Please install MetaMask to use this feature.
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {!account ? (
        <button
          onClick={connectWallet}
          disabled={isConnecting || !web3Service.isMetaMaskInstalled()}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="p-3 bg-gray-100 rounded">
            <p className="text-sm text-gray-600">Address:</p>
            <p className="font-mono text-sm break-all">{account.address}</p>
            <p className="text-sm text-gray-600 mt-2">Balance:</p>
            <p className="font-bold">{balance} ETH</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleSendTestPayment}
              disabled={isSending}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
            >
              {isSending ? 'Sending...' : 'Send Test Payment (0.001 ETH)'}
            </button>

            <button
              onClick={disconnectWallet}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Disconnect Wallet
            </button>
          </div>

          {lastTx && (
            <div className="p-3 bg-green-100 border border-green-400 rounded">
              <p className="text-sm text-green-700 font-bold">Transaction Sent!</p>
              <p className="text-xs text-green-600 font-mono break-all">Hash: {lastTx.hash}</p>
              <p className="text-xs text-green-600">Amount: {lastTx.value} ETH</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Web3Example;