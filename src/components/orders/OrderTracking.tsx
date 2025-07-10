import React from 'react';
import { ArrowLeft, Package, CheckCircle, Truck, MapPin, Clock } from 'lucide-react';
import { useOrders } from '../../contexts/OrderContext';

interface OrderTrackingProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId, isOpen, onClose, onBack }) => {
  const { getOrderById, getOrderTracking } = useOrders();

  if (!isOpen) return null;

  const order = getOrderById(orderId);
  const trackingData = getOrderTracking(orderId);

  if (!order) return null;

  const getStepIcon = (status: string, isCompleted: boolean, isCurrent: boolean) => {
    const iconClass = isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400';
    
    switch (status) {
      case 'order_placed':
        return <Package className={iconClass} size={24} />;
      case 'confirmed':
        return <CheckCircle className={iconClass} size={24} />;
      case 'processing':
        return <Clock className={iconClass} size={24} />;
      case 'shipped':
        return <Truck className={iconClass} size={24} />;
      case 'out_for_delivery':
        return <MapPin className={iconClass} size={24} />;
      case 'delivered':
        return <CheckCircle className={iconClass} size={24} />;
      default:
        return <Package className={iconClass} size={24} />;
    }
  };

  const getStatusIndex = (status: string) => {
    const statuses = ['order_placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    return statuses.indexOf(status);
  };

  const currentStatusIndex = getStatusIndex(order.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Track Order #{order.id}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Order Details</h3>
                
                <div className="space-y-3 mb-6">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Order ID:</span>
                    <p className="font-medium text-gray-800 dark:text-white">{order.id}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tracking Number:</span>
                    <p className="font-medium text-gray-800 dark:text-white">{order.trackingNumber}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Order Date:</span>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {order.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Delivery:</span>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {order.estimatedDelivery?.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Amount:</span>
                    <p className="font-bold text-lg text-gray-800 dark:text-white">${order.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-3">Delivery Address</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium text-gray-800 dark:text-white">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                    <p>{order.shippingAddress.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Tracking Timeline</h3>
                
                <div className="space-y-6">
                  {trackingData.map((tracking, index) => {
                    const isCompleted = getStatusIndex(tracking.status) <= currentStatusIndex;
                    const isCurrent = tracking.status === order.status;
                    
                    return (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-green-100 dark:bg-green-900' : 
                          isCurrent ? 'bg-blue-100 dark:bg-blue-900' : 
                          'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          {getStepIcon(tracking.status, isCompleted, isCurrent)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${
                              isCompleted ? 'text-green-600 dark:text-green-400' :
                              isCurrent ? 'text-blue-600 dark:text-blue-400' :
                              'text-gray-600 dark:text-gray-400'
                            }`}>
                              {tracking.description}
                            </h4>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {tracking.timestamp.toLocaleString()}
                            </span>
                          </div>
                          {tracking.location && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              📍 {tracking.location}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 dark:text-white">{item.product.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Quantity: {item.quantity} × ${item.product.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800 dark:text-white">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};