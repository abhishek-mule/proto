import { ethers } from 'ethers';
import { MetaMaskSDK } from '@metamask/sdk';
import {
  Web3Account,
  TransactionRequest,
  TransactionResponse,
  Web3Error,
  NetworkInfo,
  Web3Event,
  Web3EventType
} from '../types/web3';

class Web3Service {
  private sdk: MetaMaskSDK | null = null;
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private currentAccount: string | null = null;
  private eventListeners: Map<Web3EventType, ((event: Web3Event) => void)[]> = new Map();

  constructor() {
    this.initializeSDK();
  }

  private initializeSDK() {
    try {
      this.sdk = new MetaMaskSDK({
        dappMetadata: {
          name: 'Blockchain Payment App',
          url: window.location.origin,
        },
        checkInstallationImmediately: false,
      });
    } catch (error) {
      console.error('Failed to initialize MetaMask SDK:', error);
    }
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled(): boolean {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  }

  // Check if wallet is connected
  isConnected(): boolean {
    return this.currentAccount !== null;
  }

  // Get current account
  getCurrentAccount(): string | null {
    return this.currentAccount;
  }

  // Connect wallet
  async connectWallet(): Promise<Web3Account> {
    try {
      if (!this.isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed. Please install MetaMask and refresh the page.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      this.currentAccount = accounts[0];

      // Initialize ethers provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      // Get network info
      const network = await this.provider.getNetwork();
      const balance = await this.provider.getBalance(this.currentAccount!);

      // Set up event listeners
      this.setupEventListeners();

      const account: Web3Account = {
        address: this.currentAccount!,
        chainId: network.chainId.toString(),
        balance: ethers.formatEther(balance),
      };

      // Emit connect event
      this.emitEvent('connect', account);

      return account;
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      throw this.handleError(error);
    }
  }

  // Disconnect wallet
  async disconnectWallet(): Promise<void> {
    try {
      this.currentAccount = null;
      this.provider = null;
      this.signer = null;

      // Remove event listeners
      this.removeEventListeners();

      // Emit disconnect event
      this.emitEvent('disconnect');
    } catch (error: any) {
      console.error('Failed to disconnect wallet:', error);
      throw this.handleError(error);
    }
  }

  // Send transaction
  async sendTransaction(request: TransactionRequest): Promise<TransactionResponse> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      // Convert amount to wei
      const value = ethers.parseEther(request.amount);

      // Prepare transaction
      const tx = {
        to: request.to,
        value,
        data: request.data || '0x',
        gasLimit: request.gasLimit ? BigInt(request.gasLimit) : undefined,
      };

      // Send transaction
      const transactionResponse = await this.signer.sendTransaction(tx);

      // Wait for transaction to be mined (optional)
      // const receipt = await transactionResponse.wait();

      const response: TransactionResponse = {
        hash: transactionResponse.hash,
        from: transactionResponse.from,
        to: transactionResponse.to || request.to,
        value: ethers.formatEther(transactionResponse.value),
        gasPrice: transactionResponse.gasPrice?.toString() || '0',
        gasLimit: transactionResponse.gasLimit?.toString() || '0',
        nonce: transactionResponse.nonce,
        chainId: Number(transactionResponse.chainId),
      };

      return response;
    } catch (error: any) {
      console.error('Failed to send transaction:', error);
      throw this.handleError(error);
    }
  }

  // Sign message
  async signMessage(message: string): Promise<string> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const signature = await this.signer.signMessage(message);
      return signature;
    } catch (error: any) {
      console.error('Failed to sign message:', error);
      throw this.handleError(error);
    }
  }

  // Get balance
  async getBalance(address?: string): Promise<string> {
    try {
      if (!this.provider) {
        throw new Error('Wallet not connected');
      }

      const accountAddress = address || this.currentAccount;
      if (!accountAddress) {
        throw new Error('No address provided');
      }

      const balance = await this.provider.getBalance(accountAddress);
      return ethers.formatEther(balance);
    } catch (error: any) {
      console.error('Failed to get balance:', error);
      throw this.handleError(error);
    }
  }

  // Switch network
  async switchNetwork(networkInfo: NetworkInfo): Promise<void> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not available');
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkInfo.chainId }],
      });
    } catch (error: any) {
      // If network doesn't exist, try to add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkInfo],
          });
        } catch (addError: any) {
          throw this.handleError(addError);
        }
      } else {
        throw this.handleError(error);
      }
    }
  }

  // Event handling
  private setupEventListeners(): void {
    if (!window.ethereum) return;

    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        this.disconnectWallet();
      } else {
        this.currentAccount = accounts[0];
        this.emitEvent('accountsChanged', { accounts });
      }
    });

    window.ethereum.on('chainChanged', (chainId: string) => {
      this.emitEvent('chainChanged', { chainId });
      // Reload the page as recommended by MetaMask
      window.location.reload();
    });

    window.ethereum.on('disconnect', () => {
      this.disconnectWallet();
    });
  }

  private removeEventListeners(): void {
    if (!window.ethereum) return;

    window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged);
    window.ethereum.removeListener('chainChanged', this.handleChainChanged);
    window.ethereum.removeListener('disconnect', this.handleDisconnect);
  }

  private handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      this.disconnectWallet();
    } else {
      this.currentAccount = accounts[0];
      this.emitEvent('accountsChanged', { accounts });
    }
  };

  private handleChainChanged = (chainId: string) => {
    this.emitEvent('chainChanged', { chainId });
  };

  private handleDisconnect = () => {
    this.disconnectWallet();
  };

  // Event subscription
  on(eventType: Web3EventType, callback: (event: Web3Event) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  off(eventType: Web3EventType, callback: (event: Web3Event) => void): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emitEvent(type: Web3EventType, data?: any): void {
    const event: Web3Event = { type, data };
    const listeners = this.eventListeners.get(type);
    if (listeners) {
      listeners.forEach(callback => callback(event));
    }
  }

  // Error handling
  private handleError(error: any): Web3Error {
    let code = -1;
    let message = 'Unknown error occurred';

    if (error.code) {
      code = error.code;
      switch (error.code) {
        case 4001:
          message = 'User rejected the request';
          break;
        case 4902:
          message = 'Network not found';
          break;
        case -32002:
          message = 'Request already pending';
          break;
        default:
          message = error.message || message;
      }
    } else if (error.message) {
      message = error.message;
    }

    return {
      code,
      message,
      data: error.data,
    };
  }
}

// Create singleton instance
const web3Service = new Web3Service();

export default web3Service;

// Global type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}