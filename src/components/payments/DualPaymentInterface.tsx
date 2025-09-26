import React, { useState } from 'react';
import { 
  Smartphone, Bitcoin, CreditCard, QrCode, Wallet,
  Shield, Zap, ArrowRight, CheckCircle, Clock,
  Star, Award, TrendingUp, Users, Globe,
  AlertCircle, RefreshCw, Copy, ExternalLink
} from 'lucide-react';

interface DualPaymentInterfaceProps {
  amount: number;
  productName: string;
  onPaymentComplete: (paymentData: any) => void;
  onClose: () => void;
  currency?: 'USD' | 'INR';
}

const DualPaymentInterface: React.FC<DualPaymentInterfaceProps> = ({
  amount,
  productName,
  onPaymentComplete,
  onClose,
  currency = 'USD'
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'crypto'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'process' | 'complete'>('select');
  const [upiId, setUpiId] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [cryptoAmount, setCryptoAmount] = useState((amount / 2000).toFixed(6));

  const upiProviders = [
    { id: 'phonepe', name: 'PhonePe', icon: '📱', color: 'from-purple-600 to-indigo-600' },
    { id: 'googlepay', name: 'Google Pay', icon: '🔵', color: 'from-blue-600 to-blue-700' },
    { id: 'paytm', name: 'Paytm', icon: '💙', color: 'from-cyan-600 to-blue-600' },
    { id: 'bhim', name: 'BHIM UPI', icon: '🇮🇳', color: 'from-orange-600 to-red-600' }
  ];

  const cryptoOptions = [
    { symbol: 'ETH', name: 'Ethereum', amount: cryptoAmount, icon: '⟠', color: 'from-blue-600 to-indigo-600' },
    { symbol: 'BTC', name: 'Bitcoin', amount: (parseFloat(cryptoAmount) * 15).toFixed(8), icon: '₿', color: 'from-orange-600 to-yellow-600' },
    { symbol: 'USDC', name: 'USD Coin', amount: amount.toFixed(2), icon: '💵', color: 'from-green-600 to-emerald-600' },
    { symbol: 'MATIC', name: 'Polygon', amount: (amount * 1.2).toFixed(2), icon: '🔷', color: 'from-purple-600 to-pink-600' }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStep('process');

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    const paymentData = {
      id: `pay_${Date.now()}`,
      method: selectedMethod,
      amount: selectedMethod === 'upi' ? amount : parseFloat(cryptoAmount),
      currency: selectedMethod === 'upi' ? currency : 'ETH',
      status: 'completed',
      timestamp: new Date().toISOString(),
      transactionHash: selectedMethod === 'crypto' ? `0x${Math.random().toString(16).substr(2, 40)}` : undefined
    };

    setPaymentStep('complete');
    setIsProcessing(false);
    
    setTimeout(() => {
      onPaymentComplete(paymentData);
    }, 2000);
  };

  const connectWallet = async () => {
    setIsProcessing(true);
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
          <p className="text-gray-600 mb-6">
            {selectedMethod === 'upi' 
              ? 'Confirming UPI transaction...' 
              : 'Broadcasting to blockchain network...'
            }
          </p>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Product:</span>
                <span className="font-semibold text-gray-800">{productName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-gray-800">
                  {selectedMethod === 'upi' 
                    ? `${currency === 'INR' ? '₹' : '$'}${amount.toLocaleString()}` 
                    : `${cryptoAmount} ETH`
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Method:</span>
                <span className="capitalize font-semibold text-gray-800">{selectedMethod}</span>
              </div>
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
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">NFT Acquired:</span>
                <span className="font-semibold text-gray-800">{productName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-xs text-gray-800">#{Date.now()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-semibold text-gray-800">
                  {selectedMethod === 'upi' 
                    ? `${currency === 'INR' ? '₹' : '$'}${amount.toLocaleString()}` 
                    : `${cryptoAmount} ETH`
                  }
                </span>
              </div>
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
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Secure NFT Purchase</h2>
              <p className="text-green-100">Choose your preferred payment method</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Product Summary */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-8 border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">Purchase Summary</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">{productName}</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {currency === 'INR' ? '₹' : '$'}{amount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  ≈ {cryptoAmount} ETH
                </div>
              </div>
            </div>
          </div>

          {/* Dual Payment Interface */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* UPI Payment */}
            <div className={`relative overflow-hidden rounded-3xl border-3 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
              selectedMethod === 'upi' 
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-2xl shadow-blue-500/20' 
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-xl'
            }`} onClick={() => setSelectedMethod('upi')}>
              {/* Popular Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  POPULAR
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl">
                    <Smartphone className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Pay with UPI</h3>
                    <p className="text-blue-600 font-medium">Instant • Zero Fees • Secure</p>
                  </div>
                </div>

                {/* UPI Providers */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {upiProviders.map(provider => (
                    <div key={provider.id} className={`bg-gradient-to-r ${provider.color} text-white p-3 rounded-xl shadow-lg flex items-center space-x-2`}>
                      <span className="text-lg">{provider.icon}</span>
                      <span className="font-medium text-sm">{provider.name}</span>
                    </div>
                  ))}
                </div>

                {/* UPI Features */}
                <div className="space-y-3 mb-6">
                  {[
                    { icon: Zap, text: 'Instant payment confirmation' },
                    { icon: Shield, text: 'Bank-grade security' },
                    { icon: Users, text: 'Trusted by millions' },
                    { icon: Globe, text: 'Available 24/7' }
                  ].map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                          <Icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{feature.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* UPI Input */}
                {selectedMethod === 'upi' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">UPI ID</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@paytm"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
                      <QrCode className="h-16 w-16 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-blue-800 font-medium">Scan QR with your UPI app</p>
                    </div>
                  </div>
                )}

                {/* UPI Payment Button */}
                <button
                  onClick={selectedMethod === 'upi' ? handlePayment : () => setSelectedMethod('upi')}
                  className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <Smartphone className="h-6 w-6 relative z-10" />
                  <span className="relative z-10">
                    Pay {currency === 'INR' ? '₹' : '$'}{amount.toLocaleString()} with UPI
                  </span>
                  <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Crypto Payment */}
            <div className={`relative overflow-hidden rounded-3xl border-3 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
              selectedMethod === 'crypto' 
                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-2xl shadow-purple-500/20' 
                : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-xl'
            }`} onClick={() => setSelectedMethod('crypto')}>
              {/* Future Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  FUTURE
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl shadow-xl">
                    <Bitcoin className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Pay with Crypto</h3>
                    <p className="text-purple-600 font-medium">Decentralized • Global • Transparent</p>
                  </div>
                </div>

                {/* Crypto Options */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {cryptoOptions.map(crypto => (
                    <div key={crypto.symbol} className={`bg-gradient-to-r ${crypto.color} text-white p-3 rounded-xl shadow-lg`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{crypto.icon}</span>
                        <span className="font-bold text-sm">{crypto.symbol}</span>
                      </div>
                      <div className="text-xs opacity-90">{crypto.amount}</div>
                    </div>
                  ))}
                </div>

                {/* Crypto Features */}
                <div className="space-y-3 mb-6">
                  {[
                    { icon: Shield, text: 'Blockchain security' },
                    { icon: Globe, text: 'Borderless payments' },
                    { icon: TrendingUp, text: 'Potential appreciation' },
                    { icon: Award, text: 'True ownership' }
                  ].map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="p-1.5 bg-purple-100 rounded-lg">
                          <Icon className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{feature.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Wallet Connection */}
                {selectedMethod === 'crypto' && (
                  <div className="space-y-4">
                    {!walletConnected ? (
                      <button
                        onClick={connectWallet}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Connecting...</span>
                          </>
                        ) : (
                          <>
                            <Wallet className="h-4 w-4" />
                            <span>Connect Wallet First</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-green-800">Wallet Connected</span>
                        </div>
                        <p className="text-sm text-green-700">
                          Ready to pay {cryptoAmount} ETH
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Crypto Payment Button */}
                <button
                  onClick={selectedMethod === 'crypto' ? handlePayment : () => setSelectedMethod('crypto')}
                  disabled={selectedMethod === 'crypto' && !walletConnected}
                  className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-purple-700 hover:via-purple-800 hover:to-indigo-800 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <Bitcoin className="h-6 w-6 relative z-10" />
                  <span className="relative z-10">
                    Pay {cryptoAmount} ETH
                  </span>
                  <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Payment Comparison */}
          <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
            <h4 className="font-bold text-amber-800 mb-4 text-center">Payment Method Comparison</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h5 className="font-semibold text-blue-800 flex items-center space-x-2">
                  <Smartphone className="h-4 w-4" />
                  <span>UPI Payment</span>
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Processing Time:</span>
                    <span className="font-semibold text-green-600">Instant</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Fees:</span>
                    <span className="font-semibold text-green-600">₹0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Availability:</span>
                    <span className="font-semibold text-blue-600">24/7</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-purple-800 flex items-center space-x-2">
                  <Bitcoin className="h-4 w-4" />
                  <span>Crypto Payment</span>
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Processing Time:</span>
                    <span className="font-semibold text-yellow-600">2-5 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Fees:</span>
                    <span className="font-semibold text-yellow-600">Gas only</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Ownership:</span>
                    <span className="font-semibold text-purple-600">True NFT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800">Secure Payment Guarantee</h4>
                <p className="text-green-700 text-sm mt-1">
                  All transactions are encrypted and secured with blockchain technology. 
                  Your payment information is never stored on our servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualPaymentInterface;