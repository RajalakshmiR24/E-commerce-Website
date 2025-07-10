import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderTracking } from '../types';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrderTracking: (orderId: string) => OrderTracking[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      trackingNumber: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status, updatedAt: new Date() }
        : order
    ));
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  const getOrderTracking = (orderId: string): OrderTracking[] => {
    const order = getOrderById(orderId);
    if (!order) return [];

    const baseTracking: OrderTracking[] = [
      {
        orderId,
        status: 'order_placed',
        timestamp: order.createdAt,
        description: 'Order placed successfully',
        location: 'Online'
      }
    ];

    if (order.status === 'confirmed' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') {
      baseTracking.push({
        orderId,
        status: 'confirmed',
        timestamp: new Date(order.createdAt.getTime() + 30 * 60 * 1000), // 30 minutes later
        description: 'Order confirmed by seller',
        location: 'Seller Location'
      });
    }

    if (order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') {
      baseTracking.push({
        orderId,
        status: 'processing',
        timestamp: new Date(order.createdAt.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
        description: 'Order is being prepared',
        location: 'Warehouse'
      });
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      baseTracking.push({
        orderId,
        status: 'shipped',
        timestamp: new Date(order.createdAt.getTime() + 24 * 60 * 60 * 1000), // 1 day later
        description: 'Order shipped',
        location: 'Distribution Center'
      });
    }

    if (order.status === 'delivered') {
      baseTracking.push({
        orderId,
        status: 'delivered',
        timestamp: new Date(order.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days later
        description: 'Order delivered successfully',
        location: order.shippingAddress.city
      });
    }

    return baseTracking;
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus,
      getOrderById,
      getOrderTracking
    }}>
      {children}
    </OrderContext.Provider>
  );
};