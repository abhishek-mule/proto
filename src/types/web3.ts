export interface Web3Account {
  address: string;
  chainId: string;
  balance?: string;
}

export interface TransactionRequest {
  to: string;
  amount: string;
  data?: string;
  gasLimit?: string;
}

export interface TransactionResponse {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasLimit: string;
  nonce: number;
  chainId: number;
}

export interface Web3Error {
  code: number;
  message: string;
  data?: any;
}

export interface NetworkInfo {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export type Web3EventType =
  | 'accountsChanged'
  | 'chainChanged'
  | 'connect'
  | 'disconnect'
  | 'message';

export interface Web3Event {
  type: Web3EventType;
  data?: any;
}