const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');
const { generateInvoice } = require('../utils/invoice');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
router.post('/create-order', protect, [
  body('orderId').isMongoId().withMessage('Valid order ID is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Valid amount is required')
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

    const { orderId, amount } = req.body;

    // Verify order belongs to user
    const order = await Order.findById(orderId);
    if (!order || order.user.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString(),
        userId: req.user.id
      }
    });

    // Update order with Razorpay order ID
    order.payment.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(200).json({
      success: true,
      razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    next(error);
  }
});

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
router.post('/verify', protect, [
  body('razorpay_order_id').notEmpty().withMessage('Razorpay order ID is required'),
  body('razorpay_payment_id').notEmpty().withMessage('Razorpay payment ID is required'),
  body('razorpay_signature').notEmpty().withMessage('Razorpay signature is required'),
  body('orderId').isMongoId().withMessage('Valid order ID is required')
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

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Update order payment status
    const order = await Order.findById(orderId);
    if (!order || order.user.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.payment.status = 'completed';
    order.payment.razorpayPaymentId = razorpay_payment_id;
    order.payment.razorpaySignature = razorpay_signature;
    order.payment.paidAt = new Date();

    await order.addStatusHistory('confirmed', 'Payment completed successfully');

    // Generate and send invoice
    try {
      const invoiceUrl = await generateInvoice(order);
      order.invoice = {
        invoiceNumber: `INV-${order.orderNumber}`,
        invoiceUrl,
        generatedAt: new Date()
      };
      await order.save();

      // Send payment confirmation email with invoice
      await sendEmail({
        to: req.user.email,
        subject: `Payment Confirmation - ${order.orderNumber}`,
        template: 'paymentConfirmation',
        data: {
          name: req.user.name,
          order,
          invoiceUrl
        }
      });
    } catch (invoiceError) {
      console.error('Invoice generation failed:', invoiceError);
    }

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(`user-${req.user.id}`).emit('payment-success', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      amount: order.pricing.total
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Handle payment failure
// @route   POST /api/payments/failure
// @access  Private
router.post('/failure', protect, [
  body('orderId').isMongoId().withMessage('Valid order ID is required'),
  body('error').notEmpty().withMessage('Error details are required')
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

    const { orderId, error } = req.body;

    const order = await Order.findById(orderId);
    if (!order || order.user.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.payment.status = 'failed';
    await order.addStatusHistory('pending', `Payment failed: ${error.description || 'Unknown error'}`);

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment failure recorded'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Process refund
// @route   POST /api/payments/refund
// @access  Private (Admin)
router.post('/refund', protect, authorize('admin'), [
  body('orderId').isMongoId().withMessage('Valid order ID is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Valid refund amount is required'),
  body('reason').notEmpty().withMessage('Refund reason is required')
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

    const { orderId, amount, reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot refund unpaid order'
      });
    }

    // Process refund through Razorpay
    const refund = await razorpay.payments.refund(order.payment.razorpayPaymentId, {
      amount: Math.round(amount * 100), // Convert to paise
      notes: {
        reason,
        orderId: order._id.toString()
      }
    });

    // Update order
    order.payment.refundId = refund.id;
    order.payment.refundAmount = amount;
    order.payment.refundReason = reason;
    order.payment.status = amount >= order.pricing.total ? 'refunded' : 'partially_refunded';

    await order.addStatusHistory('refunded', `Refund processed: ₹${amount} - ${reason}`, req.user.id);

    // Send refund confirmation email
    try {
      await sendEmail({
        to: order.user.email,
        subject: `Refund Processed - ${order.orderNumber}`,
        template: 'refundConfirmation',
        data: {
          order,
          refundAmount: amount,
          reason
        }
      });
    } catch (emailError) {
      console.error('Refund email failed:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      refund
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
router.get('/history', protect, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({
      user: req.user.id,
      'payment.status': { $in: ['completed', 'refunded', 'partially_refunded'] }
    })
    .select('orderNumber payment pricing createdAt')
    .sort({ 'payment.paidAt': -1 })
    .skip(skip)
    .limit(limit);

    const total = await Order.countDocuments({
      user: req.user.id,
      'payment.status': { $in: ['completed', 'refunded', 'partially_refunded'] }
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      payments: orders
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;