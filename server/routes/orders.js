const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.product').isMongoId().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.name').notEmpty().withMessage('Shipping name is required'),
  body('shippingAddress.phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('shippingAddress.address').notEmpty().withMessage('Shipping address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.state').notEmpty().withMessage('State is required'),
  body('shippingAddress.pincode').isLength({ min: 6, max: 6 }).withMessage('Valid pincode is required'),
  body('payment.method').isIn(['razorpay', 'cod', 'wallet', 'upi']).withMessage('Valid payment method is required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { items, shippingAddress, billingAddress, payment, coupon, notes } = req.body;

    // Validate products and calculate pricing
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product} not found or inactive`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        variant: item.variant || {}
      });

      // Update product stock
      await product.updateStock(item.quantity, 'subtract');
    }

    // Calculate shipping and tax
    const shipping = subtotal >= 500 ? 0 : 99; // Free shipping over ₹500
    const tax = subtotal * 0.18; // 18% GST
    let discount = 0;

    // Apply coupon if provided
    if (coupon) {
      // Coupon validation logic would go here
      // For now, just apply a simple discount
      discount = coupon.discount || 0;
    }

    const total = subtotal + shipping + tax - discount;

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || { ...shippingAddress, sameAsShipping: true },
      pricing: {
        subtotal,
        shipping,
        tax,
        discount,
        total
      },
      payment: {
        method: payment.method,
        status: payment.method === 'cod' ? 'pending' : 'pending'
      },
      coupon,
      notes: notes || {},
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });

    // Add initial status to history
    await order.addStatusHistory('pending', 'Order placed successfully');

    // Send order confirmation email
    try {
      await sendEmail({
        to: req.user.email,
        subject: `Order Confirmation - ${order.orderNumber}`,
        template: 'orderConfirmation',
        data: {
          name: req.user.name,
          order,
          items: orderItems
        }
      });
    } catch (emailError) {
      console.error('Order confirmation email failed:', emailError);
    }

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(`user-${req.user.id}`).emit('order-created', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      total: order.pricing.total
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { user: req.user.id };
    
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const orders = await Order.find(filter)
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      orders
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images price brand')
      .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order (unless admin)
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, [
  body('reason').notEmpty().withMessage('Cancellation reason is required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    if (!order.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Update order status
    order.cancellation = {
      reason: req.body.reason,
      cancelledBy: req.user.id,
      cancelledAt: new Date(),
      refundStatus: 'pending'
    };

    await order.addStatusHistory('cancelled', `Order cancelled: ${req.body.reason}`, req.user.id);

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    // Send cancellation email
    try {
      await sendEmail({
        to: req.user.email,
        subject: `Order Cancelled - ${order.orderNumber}`,
        template: 'orderCancellation',
        data: {
          name: req.user.name,
          order,
          reason: req.body.reason
        }
      });
    } catch (emailError) {
      console.error('Cancellation email failed:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Request return
// @route   PUT /api/orders/:id/return
// @access  Private
router.put('/:id/return', protect, [
  body('reason').notEmpty().withMessage('Return reason is required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to return this order'
      });
    }

    if (!order.canBeReturned()) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be returned. Return window may have expired.'
      });
    }

    order.return = {
      reason: req.body.reason,
      requestedAt: new Date(),
      status: 'requested'
    };

    await order.addStatusHistory('returned', `Return requested: ${req.body.reason}`, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Return request submitted successfully',
      order
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Request exchange
// @route   PUT /api/orders/:id/exchange
// @access  Private
router.put('/:id/exchange', protect, [
  body('reason').notEmpty().withMessage('Exchange reason is required'),
  body('newProduct').isMongoId().withMessage('Valid new product ID is required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to exchange this order'
      });
    }

    if (!order.canBeExchanged()) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be exchanged. Exchange window may have expired.'
      });
    }

    // Validate new product
    const newProduct = await Product.findById(req.body.newProduct);
    if (!newProduct || !newProduct.isActive) {
      return res.status(400).json({
        success: false,
        message: 'New product not found or inactive'
      });
    }

    const priceDifference = newProduct.price - order.pricing.subtotal;

    order.exchange = {
      reason: req.body.reason,
      requestedAt: new Date(),
      status: 'requested',
      newProduct: newProduct._id,
      priceDifference
    };

    await order.addStatusHistory('exchanged', `Exchange requested: ${req.body.reason}`, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Exchange request submitted successfully',
      order,
      priceDifference
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Reorder
// @route   POST /api/orders/:id/reorder
// @access  Private
router.post('/:id/reorder', protect, async (req, res, next) => {
  try {
    const originalOrder = await Order.findById(req.params.id)
      .populate('items.product');

    if (!originalOrder) {
      return res.status(404).json({
        success: false,
        message: 'Original order not found'
      });
    }

    if (originalOrder.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reorder this order'
      });
    }

    // Check product availability and stock
    const availableItems = [];
    const unavailableItems = [];

    for (const item of originalOrder.items) {
      const product = item.product;
      
      if (!product || !product.isActive) {
        unavailableItems.push({
          name: product?.name || 'Unknown Product',
          reason: 'Product no longer available'
        });
        continue;
      }

      if (product.stock < item.quantity) {
        unavailableItems.push({
          name: product.name,
          reason: `Insufficient stock. Available: ${product.stock}, Required: ${item.quantity}`
        });
        continue;
      }

      availableItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price, // Use current price
        variant: item.variant
      });
    }

    if (availableItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items available for reorder',
        unavailableItems
      });
    }

    // Calculate new pricing
    const subtotal = availableItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 500 ? 0 : 99;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;

    // Create new order
    const newOrder = await Order.create({
      user: req.user.id,
      items: availableItems,
      shippingAddress: originalOrder.shippingAddress,
      billingAddress: originalOrder.billingAddress,
      pricing: {
        subtotal,
        shipping,
        tax,
        discount: 0,
        total
      },
      payment: {
        method: 'pending', // User will need to select payment method
        status: 'pending'
      },
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    await newOrder.addStatusHistory('pending', `Reorder from ${originalOrder.orderNumber}`);

    res.status(201).json({
      success: true,
      message: 'Reorder created successfully',
      order: newOrder,
      unavailableItems: unavailableItems.length > 0 ? unavailableItems : undefined
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Track order
// @route   GET /api/orders/:id/track
// @access  Private
router.get('/:id/track', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to track this order'
      });
    }

    res.status(200).json({
      success: true,
      tracking: {
        orderNumber: order.orderNumber,
        status: order.status,
        trackingNumber: order.tracking.trackingNumber,
        carrier: order.tracking.carrier,
        estimatedDelivery: order.estimatedDelivery,
        actualDelivery: order.actualDelivery,
        statusHistory: order.statusHistory,
        trackingHistory: order.tracking.trackingHistory
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;