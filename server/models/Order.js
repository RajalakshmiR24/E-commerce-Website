const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  variant: {
    color: String,
    size: String,
    other: mongoose.Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'exchanged'],
    default: 'pending'
  },
  trackingInfo: {
    trackingNumber: String,
    carrier: String,
    estimatedDelivery: Date,
    actualDelivery: Date
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    landmark: String,
    addressType: {
      type: String,
      enum: ['home', 'office', 'other'],
      default: 'home'
    }
  },
  billingAddress: {
    name: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    sameAsShipping: {
      type: Boolean,
      default: true
    }
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    shipping: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['razorpay', 'cod', 'wallet', 'upi'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending'
    },
    transactionId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paidAt: Date,
    refundId: String,
    refundAmount: Number,
    refundReason: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'exchanged'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  tracking: {
    trackingNumber: String,
    carrier: String,
    trackingUrl: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    trackingHistory: [{
      status: String,
      location: String,
      timestamp: Date,
      description: String
    }]
  },
  coupon: {
    code: String,
    discount: Number,
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    }
  },
  notes: {
    customer: String,
    internal: String
  },
  cancellation: {
    reason: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed']
    }
  },
  return: {
    reason: String,
    requestedAt: Date,
    approvedAt: Date,
    status: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'picked_up', 'received', 'refunded']
    },
    refundAmount: Number,
    returnTrackingNumber: String
  },
  exchange: {
    reason: String,
    requestedAt: Date,
    approvedAt: Date,
    status: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'picked_up', 'received', 'shipped', 'delivered']
    },
    newProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    priceDifference: Number,
    exchangeTrackingNumber: String
  },
  invoice: {
    invoiceNumber: String,
    invoiceUrl: String,
    generatedAt: Date
  },
  estimatedDelivery: Date,
  actualDelivery: Date,
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: String,
  priority: {
    type: String,
    enum: ['normal', 'high', 'urgent'],
    default: 'normal'
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Method to add status to history
orderSchema.methods.addStatusHistory = function(status, note = '', updatedBy = null) {
  this.statusHistory.push({
    status,
    note,
    updatedBy,
    timestamp: new Date()
  });
  this.status = status;
  return this.save();
};

// Method to calculate total
orderSchema.methods.calculateTotal = function() {
  const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.pricing.subtotal = subtotal;
  this.pricing.total = subtotal + this.pricing.shipping + this.pricing.tax - this.pricing.discount;
  return this.pricing.total;
};

// Method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  const cancellableStatuses = ['pending', 'confirmed', 'processing'];
  return cancellableStatuses.includes(this.status);
};

// Method to check if order can be returned
orderSchema.methods.canBeReturned = function() {
  const returnableStatuses = ['delivered'];
  const deliveryDate = this.actualDelivery || this.createdAt;
  const daysSinceDelivery = (Date.now() - deliveryDate) / (1000 * 60 * 60 * 24);
  return returnableStatuses.includes(this.status) && daysSinceDelivery <= 30;
};

// Method to check if order can be exchanged
orderSchema.methods.canBeExchanged = function() {
  const exchangeableStatuses = ['delivered'];
  const deliveryDate = this.actualDelivery || this.createdAt;
  const daysSinceDelivery = (Date.now() - deliveryDate) / (1000 * 60 * 60 * 24);
  return exchangeableStatuses.includes(this.status) && daysSinceDelivery <= 15;
};

// Indexes for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);