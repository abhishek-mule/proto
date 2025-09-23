import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Wallet, ExternalLink, Copy, CheckCircle, 
  AlertTriangle, Zap, Shield, X 
} from 'lucide-react';

interface WalletConnectionProps {
  onClose?: () => void;
  showAsModal?: boolean;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ 
  onClose, 
  showAsModal = false 
}) => {
  const { walletConnection, connectWallet, disconnectWallet } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      await connectWallet();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    if (onClose) onClose();
  };

  const copyAddress = async () => {
    if (walletConnection?.address) {
      await navigator.clipboard.writeText(walletConnection.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Digital Wallet</h2>
            <p className="text-sm text-gray-600">Connect your wallet for blockchain transactions</p>
          </div>
        </div>
        {showAsModal && onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {!walletConnection ? (
        /* Connect Wallet */
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <h3 className="font-semibold text-gray-800 mb-3">Why Connect Your Wallet?</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>Secure blockchain transactions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-purple-600" />
                <span>Instant crypto payments</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Verified supply chain interactions</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">Supported Wallets</h4>
            
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 flex items-center space-x-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
              </div>
              <div className="flex-1 text-left">
                <h5 className="font-semibold text-gray-800">MetaMask</h5>
                <p className="text-sm text-gray-600">Connect using MetaMask wallet</p>
              </div>
              {isConnecting ? (
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ExternalLink className="h-5 w-5 text-gray-400" />
              )}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                disabled
                className="p-3 border-2 border-gray-200 rounded-lg text-center opacity-50 cursor-not-allowed"
              >
                <div className="text-sm font-medium text-gray-600">WalletConnect</div>
                <div className="text-xs text-gray-500">Coming Soon</div>
              </button>
              <button
                disabled
                className="p-3 border-2 border-gray-200 rounded-lg text-center opacity-50 cursor-not-allowed"
              >
                <div className="text-sm font-medium text-gray-600">Coinbase</div>
                <div className="text-xs text-gray-500">Coming Soon</div>
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Security Notice</p>
                <p>Never share your private keys or seed phrase. AgroChain will never ask for this information.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Wallet Connected */
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span className="font-semibold text-green-800">Wallet Connected</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Address:</span>
                <div className="flex items-center space-x-2">
                  <code className="text-sm font-mono bg-white px-2 py-1 rounded border">
                    {formatAddress(walletConnection.address)}
                  </code>
                  <button
                    onClick={copyAddress}
                    className="p-1 hover:bg-green-100 rounded transition-colors"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Balance:</span>
                <span className="font-semibold text-gray-800">
                  {walletConnection.balance} ETH
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Network:</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
                  {walletConnection.network}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              View Transactions
            </button>
            <button
              onClick={handleDisconnect}
              className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Disconnect
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Available Actions</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <div>• Make secure payments with cryptocurrency</div>
              <div>• Verify product authenticity on blockchain</div>
              <div>• Access exclusive blockchain features</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (showAsModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {content}
    </div>
  );
};

export default WalletConnection;