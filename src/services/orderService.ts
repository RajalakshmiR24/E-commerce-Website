import { api, endpoints } from './api';
import { Order, ShippingAddress, CartItem } from '../types';

export interface CreateOrderRequest {
  items: Array<{
    product: string;
    quantity: number;
    variant?: any;
  }>;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  payment: {
    method: 'razorpay' | 'cod' | 'wallet' | 'upi';
  };
  coupon?: {
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  };
  notes?: {
    customer?: string;
  };
}

export interface OrdersResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  orders: Order[];
}

export interface OrderTrackingResponse {
  success: boolean;
  tracking: {
    orderNumber: string;
    status: string;
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
    statusHistory: Array<{
      status: string;
      timestamp: string;
      note?: string;
    }>;
    trackingHistory?: Array<{
      status: string;
      location: string;
      timestamp: string;
      description: string;
    }>;
  };
}

class OrderService {
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await api.post<{ order: Order }>(endpoints.orders.create, orderData);
    
    if (response.success && response.data) {
      return response.data.order;
    }
    
    throw new Error(response.message || 'Failed to create order');
  }

  async getOrders(params: { page?: number; limit?: number; status?: string } = {}): Promise<OrdersResponse> {
    const response = await api.get<OrdersResponse>(endpoints.orders.list, params);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch orders');
  }

  async getOrderById(id: string): Promise<Order> {
    const response = await api.get<{ order: Order }>(endpoints.orders.detail(id));
    
    if (response.success && response.data) {
      return response.data.order;
    }
    
    throw new Error(response.message || 'Failed to fetch order');
  }

  async cancelOrder(id: string, reason: string): Promise<Order> {
    const response = await api.put<{ order: Order }>(endpoints.orders.cancel(id), { reason });
    
    if (response.success && response.data) {
      return response.data.order;
    }
    
    throw new Error(response.message || 'Failed to cancel order');
  }

  async returnOrder(id: string, reason: string): Promise<Order> {
    const response = await api.put<{ order: Order }>(endpoints.orders.return(id), { reason });
    
    if (response.success && response.data) {
      return response.data.order;
    }
    
    throw new Error(response.message || 'Failed to request return');
  }

  async exchangeOrder(id: string, reason: string, newProductId: string): Promise<Order> {
    const response = await api.put<{ order: Order }>(endpoints.orders.exchange(id), {
      reason,
      newProduct: newProductId
    });
    
    if (response.success && response.data) {
      return response.data.order;
    }
    
    throw new Error(response.message || 'Failed to request exchange');
  }

  async trackOrder(id: string): Promise<OrderTrackingResponse['tracking']> {
    const response = await api.get<OrderTrackingResponse>(endpoints.orders.track(id));
    
    if (response.success && response.data) {
      return response.data.tracking;
    }
    
    throw new Error(response.message || 'Failed to track order');
  }

  async reorderOrder(id: string): Promise<Order> {
    const response = await api.post<{ order: Order; unavailableItems?: any[] }>(
      endpoints.orders.reorder(id)
    );
    
    if (response.success && response.data) {
      return response.data.order;
    }
    
    throw new Error(response.message || 'Failed to reorder');
  }
}

export const orderService = new OrderService();