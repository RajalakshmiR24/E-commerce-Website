import React, { useState, useEffect } from 'react';
import { X, CreditCard, CheckCircle, XCircle, QrCode } from 'lucide-react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useCart } from '../../contexts/CartContext';
import { useOrders } from '../../contexts/OrderContext';
import { useAuth } from '../../contexts/AuthContext';
import { ShippingAddress } from '../../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  shippingAddress: ShippingAddress;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount, shippingAddress }) => {
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'qr'>('card');
  const [showQR, setShowQR] = useState(false);
  const { items, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && paymentMethod !== 'qr') {
      // Simulate payment processing for card and UPI
      const timer = setTimeout(() => {
        const isSuccess = Math.random() > 0.2; // 80% success rate
        setPaymentStatus(isSuccess ? 'success' : 'failed');
        
        if (isSuccess && user) {
          addOrder({
            userId: user.id,
            items: [...items],
            total: amount,
            status: 'pending',
            shippingAddress,
            paymentStatus: 'completed',
            paymentMethod: paymentMethod === 'card' ? 'Credit Card' : 'UPI'
          });
          clearCart();
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, paymentMethod, clearCart, addOrder, user, items, amount, shippingAddress]);

  if (!isOpen) return null;

  const handleClose = () => {
    setPaymentStatus('processing');
    setPaymentMethod('card');
    setShowQR(false);
    onClose();
  };

  const handleQRPayment = () => {
    setShowQR(true);
    // Simulate QR payment processing
    setTimeout(() => {
      setPaymentStatus('success');
      if (user) {
        addOrder({
          userId: user.id,
          items: [...items],
          total: amount,
          status: 'pending',
          shippingAddress,
          paymentStatus: 'completed',
          paymentMethod: 'QR Code'
        });
        clearCart();
      }
    }, 2000);
  };

  const generateQRCode = () => {
    // Generate a simple QR code pattern for demonstration
    const qrData = `upi://pay?pa=merchant@paytm&pn=AbiStore&am=${amount}&cu=INR&tn=Payment for Order`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Payment</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>

          <div className="text-center">
            {paymentStatus === 'processing' && !showQR && (
              <div className="space-y-6">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-6 w-20 h-20 flex items-center justify-center mx-auto">
                  <CreditCard className="text-blue-600 dark:text-blue-400" size={32} />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Choose Payment Method
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Amount to pay: ₹{amount.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full p-4 rounded-lg border-2 transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard size={20} />
                      <span className="font-medium">Credit/Debit Card</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`w-full p-4 rounded-lg border-2 transition-colors ${
                      paymentMethod === 'upi'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-orange-500 rounded"></div>
                      <span className="font-medium">UPI Payment</span>
                    </div>
                  </button>

                  <button
                    onClick={handleQRPayment}
                    className="w-full p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <QrCode size={20} />
                      <span className="font-medium">Scan QR Code</span>
                    </div>
                  </button>
                </div>

                {paymentMethod !== 'qr' && (
                  <div className="mt-6">
                    <LoadingSpinner size="lg" className="mx-auto" />
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Processing payment...
                    </p>
                  </div>
                )}
              </div>
            )}

            {showQR && paymentStatus === 'processing' && (
              <div className="space-y-4">
                <div className="bg-green-100 dark:bg-green-900 rounded-full p-6 w-20 h-20 flex items-center justify-center mx-auto">
                  <QrCode className="text-green-600 dark:text-green-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Scan QR Code to Pay
                </h3>
                <div className="bg-white p-4 rounded-lg inline-block">
                  <img
                    src={generateQRCode()}
                    alt="Payment QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Amount: ₹{amount.toFixed(2)}
                </p>
                <LoadingSpinner size="md" className="mx-auto" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Waiting for payment confirmation...
                </p>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="space-y-4">
                <div className="bg-green-100 dark:bg-green-900 rounded-full p-6 w-20 h-20 flex items-center justify-center mx-auto">
                  <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">
                  Payment Successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your payment of ₹{amount.toFixed(2)} has been processed successfully.
                </p>
                <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 mt-4">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    🎉 Your order has been placed successfully! You can track it in "My Orders" section.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="space-y-4">
                <div className="bg-red-100 dark:bg-red-900 rounded-full p-6 w-20 h-20 flex items-center justify-center mx-auto">
                  <XCircle className="text-red-600 dark:text-red-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">
                  Payment Failed
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your payment of ₹{amount.toFixed(2)} could not be processed.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Please try again or use a different payment method.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => setPaymentStatus('processing')}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};