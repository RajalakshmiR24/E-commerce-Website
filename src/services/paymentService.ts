import { api, endpoints } from './api';

export interface CreateRazorpayOrderRequest {
  orderId: string;
  amount: number;
}

export interface RazorpayOrderResponse {
  success: boolean;
  razorpayOrder: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
  };
  key: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}

export interface PaymentFailureRequest {
  orderId: string;
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
  };
}

export interface PaymentHistoryResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  payments: Array<{
    orderNumber: string;
    payment: {
      status: string;
      razorpayPaymentId?: string;
      paidAt?: string;
    };
    pricing: {
      total: number;
    };
    createdAt: string;
  }>;
}

class PaymentService {
  async createRazorpayOrder(data: CreateRazorpayOrderRequest): Promise<RazorpayOrderResponse> {
    const response = await api.post<RazorpayOrderResponse>(endpoints.payments.createOrder, data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to create payment order');
  }

  async verifyPayment(data: VerifyPaymentRequest): Promise<{ order: any }> {
    const response = await api.post<{ order: any }>(endpoints.payments.verify, data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Payment verification failed');
  }

  async handlePaymentFailure(data: PaymentFailureRequest): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(endpoints.payments.failure, data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to handle payment failure');
  }

  async getPaymentHistory(params: { page?: number; limit?: number } = {}): Promise<PaymentHistoryResponse> {
    const response = await api.get<PaymentHistoryResponse>(endpoints.payments.history, params);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch payment history');
  }

  // Razorpay integration helper
  async processRazorpayPayment(
    orderId: string,
    amount: number,
    userDetails: {
      name: string;
      email: string;
      phone: string;
    }
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Create Razorpay order
        const { razorpayOrder, key } = await this.createRazorpayOrder({ orderId, amount });

        // Load Razorpay script if not already loaded
        if (!window.Razorpay) {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => this.openRazorpayCheckout();
          script.onerror = () => reject(new Error('Failed to load Razorpay'));
          document.head.appendChild(script);
        } else {
          this.openRazorpayCheckout();
        }

        const openRazorpayCheckout = () => {
          const options = {
            key,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: 'Abi Store',
            description: `Order #${orderId}`,
            order_id: razorpayOrder.id,
            prefill: {
              name: userDetails.name,
              email: userDetails.email,
              contact: userDetails.phone,
            },
            theme: {
              color: '#3B82F6',
            },
            handler: async (response: any) => {
              try {
                await this.verifyPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId,
                });
                resolve();
              } catch (error) {
                reject(error);
              }
            },
            modal: {
              ondismiss: () => {
                reject(new Error('Payment cancelled by user'));
              },
            },
          };

          const razorpay = new window.Razorpay(options);
          razorpay.open();
        };

        this.openRazorpayCheckout = openRazorpayCheckout;
      } catch (error) {
        reject(error);
      }
    });
  }

  private openRazorpayCheckout?: () => void;
}

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

export const paymentService = new PaymentService();