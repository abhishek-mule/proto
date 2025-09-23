import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  CreditCard, Smartphone, Bitcoin, DollarSign, 
  Shield, CheckCircle, AlertCircle, Clock,
  QrCode, Wallet, ArrowRight, ExternalLink, Zap
} from 'lucide-react';

interface PaymentSystemProps {
  amount: number;
  productName: string;
  onPaymentComplete: (paymentData: any) => void;
  onClose: () => void;
  currency?: 'USD' | 'INR';
  paymentMethod?: 'upi' | 'crypto';
}

const PaymentSystem: React.FC<PaymentSystemProps> = ({
  amount,
  productName,
  onPaymentComplete,
  onClose,
  currency = 'USD',
  paymentMethod: initialPaymentMethod = 'card'
}) => {
  const { user, walletConnection } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<string>(initialPaymentMethod);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'process' | 'complete'>('select');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    cryptoAmount: '',
    selectedWallet: ''
  });
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  const walletOptions = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Most popular Ethereum wallet',
      installed: typeof window !== 'undefined' && typeof window.ethereum !== 'undefined',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🔗',
      description: 'Connect any mobile wallet',
      installed: true,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🔵',
      description: 'Coinbase\'s self-custody wallet',
      installed: true,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'trust',
      name: 'Trust Wallet',
      icon: '🛡️',
      description: 'Mobile-first crypto wallet',
      installed: true,
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express',
      fees: '2.9% + $0.30',
      available: true
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: Smartphone,
      description: 'PhonePe, Google Pay, Paytm',
      fees: 'No fees',
      available: true
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: Bitcoin,
      description: 'ETH, BTC, USDC',
      fees: 'Network fees only',
      available: !!walletConnection
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: DollarSign,
      description: 'Direct bank transfer',
      fees: '$1.00 flat fee',
      available: true
    }
  ];

  const handleWalletConnect = async (walletId: string) => {
    setIsConnectingWallet(true);
    setPaymentData({...paymentData, selectedWallet: walletId});
    
    try {
      if (walletId === 'metamask') {
        await connectWallet();
      } else {
        // Simulate connection for other wallets
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Auto-proceed to payment after successful connection
      setTimeout(() => {
        handlePayment();
      }, 1000);
      
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStep('process');

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    const payment = {
      id: `pay_${Date.now()}`,
      method: selectedMethod,
      amount,
      status: 'completed',
      timestamp: new Date().toISOString(),
      transactionHash: selectedMethod === 'crypto' ? `0x${Math.random().toString(16).substr(2, 40)}` : undefined
    };

    setPaymentStep('complete');
    setIsProcessing(false);
    
    setTimeout(() => {
      onPaymentComplete(payment);
    }, 2000);
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <input
                type="text"
                value={paymentData.cardNumber}
                onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="text"
                  value={paymentData.expiryDate}
                  onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  type="text"
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 'upi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
              <input
                type="text"
                value={paymentData.upiId}
                onChange={(e) => setPaymentData({...paymentData, upiId: e.target.value})}
                placeholder="yourname@paytm"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <QrCode className="h-16 w-16 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-800">Scan QR code with your UPI app</p>
            </div>
          </div>
        );

      case 'crypto':
        return (
          <div className="space-y-4">
            {!showWalletOptions && !walletConnection ? (
              <div className="text-center">
                <button
                  onClick={() => setShowWalletOptions(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
                >
                  <Wallet className="h-5 w-5" />
                  <span>Choose Wallet to Connect</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : showWalletOptions ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-800">Select Your Wallet</h4>
                  <button
                    onClick={() => setShowWalletOptions(false)}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    ← Back
                  </button>
                </div>
                
                <div className="grid gap-3">
                  {walletOptions.map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => handleWalletConnect(wallet.id)}
                      disabled={isConnectingWallet || !wallet.installed}
                      className={`
                        w-full p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 
                        ${wallet.installed 
                          ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer' 
                          : 'border-gray-200 opacity-50 cursor-not-allowed'
                        }
                        ${isConnectingWallet && paymentData.selectedWallet === wallet.id 
                          ? 'border-purple-500 bg-purple-50' 
                          : ''
                        }
                      `}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${wallet.color} flex items-center justify-center text-2xl shadow-lg`}>
                          {wallet.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center space-x-2">
                            <h5 className="font-semibold text-gray-800">{wallet.name}</h5>
                            {wallet.installed && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                Available
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{wallet.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isConnectingWallet && paymentData.selectedWallet === wallet.id ? (
                            <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : wallet.installed ? (
                            <div className="flex items-center space-x-1 text-purple-600">
                              <Zap className="h-4 w-4" />
                              <span className="text-sm font-medium">Connect</span>
                            </div>
                          ) : (
                            <ExternalLink className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Instant Connection</p>
                      <p>Your wallet will connect automatically and proceed with the transaction. No additional steps required.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : walletConnection ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Wallet Connected</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Address: {walletConnection.address.slice(0, 10)}...
                  </p>
                  <p className="text-sm text-green-700">
                    Balance: {walletConnection.balance} ETH
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Ready for Instant Payment</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Transaction will be processed immediately upon confirmation.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (ETH)
                  </label>
                  <input
                    type="text"
                    value={(amount / 2000).toFixed(6)} // Mock ETH conversion
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            ) : null}
          </div>
        );

      case 'bank':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Bank Transfer Details</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <p>Account: AgroChain Payments</p>
                <p>Routing: 123456789</p>
                <p>Account: 987654321</p>
                <p>Reference: ORDER_{Date.now()}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Transfer will be processed within 1-3 business days
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  if (paymentStep === 'process') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Processing Payment</h3>
          <p className="text-gray-600 mb-4">Please wait while we process your payment...</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <span>Amount:</span>
              <span className="font-semibold">${amount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span>Method:</span>
              <span className="capitalize">{selectedMethod}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStep === 'complete') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-4">Your order has been confirmed</p>
          <div className="bg-green-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span>Product:</span>
              <span className="font-semibold">{productName}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span>Amount Paid:</span>
              <span className="font-semibold">{currency === 'INR' ? '₹' : '$'}{currency === 'INR' ? amount.toLocaleString() : amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Secure Payment</h2>
              <p className="text-gray-600">Complete your purchase</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">{productName}</span>
              <span className="font-bold text-gray-900">{currency === 'INR' ? '₹' : '$'}{currency === 'INR' ? amount.toLocaleString() : amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <span>Select Payment Method</span>
              {selectedMethod === 'crypto' && (
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                  Instant Connection
                </span>
              )}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    disabled={!method.available}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : method.available
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-200 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className={`h-6 w-6 mt-1 ${
                        selectedMethod === method.id ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{method.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">{method.description}</p>
                        <p className="text-xs text-gray-500">Fees: {method.fees}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Form */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Payment Details</h3>
            {renderPaymentForm()}
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Secure Payment</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Your payment information is encrypted and secure. We never store your payment details.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing || isConnectingWallet || (selectedMethod === 'crypto' && !walletConnection && !showWalletOptions)}
              className={`flex-1 text-white py-4 px-6 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl ${
                selectedMethod === 'crypto' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' 
                  : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
              }`}
            >
              {isConnectingWallet ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting Wallet...</span>
                </>
              ) : selectedMethod === 'crypto' && !walletConnection ? (
                <>
                  <Wallet className="h-5 w-5" />
                  <span>Connect & Pay {((amount) / 2000).toFixed(6)} ETH</span>
                </>
              ) : (
                <>
                  <span>Pay {currency === 'INR' ? '₹' : '$'}{currency === 'INR' ? amount.toLocaleString() : amount.toFixed(2)}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSystem;