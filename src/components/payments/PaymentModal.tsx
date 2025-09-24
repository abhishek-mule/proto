import React, { useState } from 'react';
import { 
  X, Smartphone, Bitcoin, CreditCard, Shield, 
  QrCode, Wallet, ArrowRight, CheckCircle, Clock,
  Zap, Star, MapPin, Calendar
} from 'lucide-react';

interface PaymentModalProps {
  nft: {
    id: string;
    tokenId: string;
    cropName: string;
    cropImage: string;
    farmerName: string;
    farmLocation: string;
    price: number;
    rating: number;
    reviews: number;
  };
  onClose: () => void;
  onPaymentComplete: (paymentData: any) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ nft, onClose, onPaymentComplete }) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'crypto' | 'card'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'process' | 'complete'>('select');
  const [upiId, setUpiId] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);

  const paymentMethods = [
    {
      id: 'upi' as const,
      name: 'Pay with UPI',
      icon: Smartphone,
      description: 'PhonePe • Google Pay • Paytm • BHIM',
      fees: 'No fees',
      processingTime: 'Instant',
      color: 'from-blue-600 to-indigo-700',
      hoverColor: 'from-blue-700 to-indigo-800',
      popular: true
    },
    {
      id: 'crypto' as const,
      name: 'Pay with Crypto',
      icon: Bitcoin,
      description: 'ETH • BTC • USDC • MATIC',
      fees: 'Network fees only',
      processingTime: '2-5 minutes',
      color: 'from-purple-600 to-indigo-700',
      hoverColor: 'from-purple-700 to-indigo-800',
      popular: false
    },
    {
      id: 'card' as const,
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa • Mastercard • RuPay',
      fees: '2.9% + ₹2',
      processingTime: 'Instant',
      color: 'from-green-600 to-emerald-700',
      hoverColor: 'from-green-700 to-emerald-800',
      popular: false
    }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStep('process');

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    const paymentData = {
      id: `pay_${Date.now()}`,
      method: selectedMethod,
      amount: nft.price,
      nftId: nft.id,
      status: 'completed',
      timestamp: new Date().toISOString()
    };

    setPaymentStep('complete');
    setIsProcessing(false);
    
    setTimeout(() => {
      onPaymentComplete(paymentData);
    }, 2000);
  };

  const connectWallet = async () => {
    setIsProcessing(true);
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    setWalletConnected(true);
    setIsProcessing(false);
  };

  if (paymentStep === 'process') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Processing Payment</h3>
          <p className="text-gray-600 mb-6">Securing your NFT on the blockchain...</p>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">NFT:</span>
              <span className="font-semibold text-gray-800">#{nft.tokenId}</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold text-gray-800">${nft.price}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Method:</span>
              <span className="capitalize font-semibold text-gray-800">{selectedMethod}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStep === 'complete') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Payment Successful!</h3>
          <p className="text-gray-600 mb-6">Your NFT has been secured on the blockchain</p>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200 mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">NFT Acquired:</span>
              <span className="font-semibold text-gray-800">{nft.cropName}</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Token ID:</span>
              <span className="font-semibold text-gray-800">#{nft.tokenId}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-semibold text-gray-800">${nft.price}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            View My NFTs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Secure NFT Purchase</h2>
              <p className="text-gray-600">Complete your blockchain transaction</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 p-6">
          {/* NFT Details */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-amber-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">NFT Details</h3>
              
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={nft.cropImage}
                  alt={nft.cropName}
                  className="w-16 h-16 rounded-xl object-cover shadow-md"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{nft.cropName}</h4>
                  <p className="text-sm text-gray-600">Token #{nft.tokenId}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">${nft.price}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Farmer:</span>
                  <span className="font-semibold text-gray-800">{nft.farmerName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Location:</span>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-green-600" />
                    <span className="font-semibold text-gray-800">{nft.farmLocation}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-gray-800">{nft.rating} ({nft.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-bold text-blue-800">Security Guarantee</h3>
              </div>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>Blockchain-verified authenticity</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>Immutable ownership records</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>Complete supply chain transparency</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>Secure payment processing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Choose Payment Method</h3>
              <div className="space-y-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;
                  
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-[1.02] relative overflow-hidden ${
                        isSelected
                          ? 'border-green-500 bg-green-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                      }`}
                    >
                      {method.popular && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            POPULAR
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${method.color} shadow-lg`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 text-lg mb-1">{method.name}</h4>
                          <p className="text-gray-600 mb-3">{method.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                              <span className="text-gray-500">Fees: <span className="font-semibold text-green-600">{method.fees}</span></span>
                              <span className="text-gray-500">Time: <span className="font-semibold text-blue-600">{method.processingTime}</span></span>
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-gray-800 mb-4">Payment Details</h4>
              
              {selectedMethod === 'upi' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@paytm"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
                    <QrCode className="h-16 w-16 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-blue-800 font-medium">Scan QR code with your UPI app</p>
                  </div>
                </div>
              )}

              {selectedMethod === 'crypto' && (
                <div className="space-y-4">
                  {!walletConnected ? (
                    <div className="text-center">
                      <button
                        onClick={connectWallet}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center space-x-3 disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Connecting Wallet...</span>
                          </>
                        ) : (
                          <>
                            <Wallet className="h-5 w-5" />
                            <span>Connect Crypto Wallet</span>
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800">Wallet Connected</span>
                      </div>
                      <p className="text-sm text-green-700">
                        Ready to process payment of {(nft.price / 2000).toFixed(6)} ETH
                      </p>
                    </div>
                  )}
                </div>
              )}

              {selectedMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing || (selectedMethod === 'crypto' && !walletConnected)}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 ${
                selectedMethod === 'upi' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white'
                  : selectedMethod === 'crypto'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white'
                  : 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white'
              }`}
            >
              <Zap className="h-5 w-5" />
              <span>
                {selectedMethod === 'upi' ? 'Pay with UPI' : 
                 selectedMethod === 'crypto' ? 'Pay with Crypto' : 
                 'Pay with Card'} - ${nft.price}
              </span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;