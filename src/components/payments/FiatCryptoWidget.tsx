import React, { useState } from 'react';
import { IndianRupee, CreditCard, ArrowRight, Check, AlertCircle } from 'lucide-react';
import fiatCryptoService from '../../services/fiatCryptoService';

interface FiatCryptoWidgetProps {
  amount: number;
  tokenId?: string;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

const FiatCryptoWidget: React.FC<FiatCryptoWidgetProps> = ({
  amount,
  tokenId,
  onSuccess,
  onError,
  className = ''
}) => {
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [transactionId, setTransactionId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!upiId) {
      setStatus('error');
      setErrorMessage('Please enter a valid UPI ID');
      onError?.('Please enter a valid UPI ID');
      return;
    }

    try {
      setLoading(true);
      setStatus('processing');
      
      const result = await fiatCryptoService.processUpiPayment({
        amount,
        upiId,
        tokenId,
        metadata: {
          paymentType: 'purchase',
          timestamp: new Date().toISOString()
        }
      });
      
      setTransactionId(result.transactionId);
      setStatus('success');
      onSuccess?.(result.transactionId);
    } catch (error) {
      console.error('Payment error:', error);
      setStatus('error');
      const errorMsg = error instanceof Error ? error.message : 'Payment processing failed';
      setErrorMessage(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <CreditCard size={18} />
          Fiat-to-Crypto Payment
        </h3>
      </div>
      
      <div className="p-4">
        {status === 'success' ? (
          <div className="text-center py-4">
            <div className="bg-green-100 text-green-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Check size={32} />
            </div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">Payment Successful!</h4>
            <p className="text-gray-600 mb-4">Your payment has been processed successfully.</p>
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              <div className="font-medium">Transaction ID:</div>
              <div className="text-gray-700 break-all">{transactionId}</div>
            </div>
          </div>
        ) : status === 'error' ? (
          <div className="text-center py-4">
            <div className="bg-red-100 text-red-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">Payment Failed</h4>
            <p className="text-red-600 mb-4">{errorMessage}</p>
            <button
              onClick={() => setStatus('idle')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <form onSubmit={handlePayment}>
            <div className="mb-6">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-gray-800">₹{amount.toLocaleString()}</div>
                <div className="text-gray-500 text-sm">Pay using UPI</div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                  UPI ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="upiId"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@upi"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Processing...
                </>
              ) : (
                <>
                  Pay Now <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FiatCryptoWidget;