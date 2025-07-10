const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email templates
const emailTemplates = {
  emailVerification: {
    subject: 'Verify Your Email - Abi Store',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3B82F6;">Welcome to Abi Store!</h2>
        <p>Hi ${data.name},</p>
        <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationUrl}" 
             style="background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${data.verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Best regards,<br>
          The Abi Store Team
        </p>
      </div>
    `
  },

  welcome: {
    subject: 'Welcome to Abi Store!',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3B82F6;">Welcome to Abi Store, ${data.name}! 🎉</h2>
        <p>Your email has been verified successfully!</p>
        <p>You're now part of our community and can enjoy:</p>
        <ul>
          <li>✅ Access to thousands of quality products</li>
          <li>✅ Exclusive deals and discounts</li>
          <li>✅ Fast and secure checkout</li>
          <li>✅ Order tracking and support</li>
          <li>✅ Personalized recommendations</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}" 
             style="background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Start Shopping Now
          </a>
        </div>
        <p>Happy shopping!</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Best regards,<br>
          The Abi Store Team
        </p>
      </div>
    `
  },

  passwordReset: {
    subject: 'Reset Your Password - Abi Store',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3B82F6;">Password Reset Request</h2>
        <p>Hi ${data.name},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetUrl}" 
             style="background-color: #EF4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${data.resetUrl}</p>
        <p><strong>This link will expire in 10 minutes for security reasons.</strong></p>
        <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Best regards,<br>
          The Abi Store Team
        </p>
      </div>
    `
  },

  orderConfirmation: {
    subject: (data) => `Order Confirmation - ${data.order.orderNumber}`,
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">Order Confirmed! 🎉</h2>
        <p>Hi ${data.name},</p>
        <p>Thank you for your order! We've received your order and it's being processed.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Order Number:</strong> ${data.order.orderNumber}</p>
          <p><strong>Order Date:</strong> ${new Date(data.order.createdAt).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> ₹${data.order.pricing.total.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> ${data.order.payment.method.toUpperCase()}</p>
        </div>

        <h3>Items Ordered:</h3>
        ${data.items.map(item => `
          <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
            <p><strong>${item.product.name}</strong></p>
            <p>Quantity: ${item.quantity} × ₹${item.price} = ₹${(item.quantity * item.price).toFixed(2)}</p>
          </div>
        `).join('')}

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Shipping Address</h3>
          <p>${data.order.shippingAddress.name}<br>
          ${data.order.shippingAddress.address}<br>
          ${data.order.shippingAddress.city}, ${data.order.shippingAddress.state} ${data.order.shippingAddress.pincode}<br>
          Phone: ${data.order.shippingAddress.phone}</p>
        </div>

        <p>We'll send you another email when your order ships with tracking information.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/orders/${data.order._id}" 
             style="background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Track Your Order
          </a>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Best regards,<br>
          The Abi Store Team
        </p>
      </div>
    `
  },

  paymentConfirmation: {
    subject: (data) => `Payment Confirmation - ${data.order.orderNumber}`,
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">Payment Received! ✅</h2>
        <p>Hi ${data.name},</p>
        <p>We've successfully received your payment for order ${data.order.orderNumber}.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Payment Details</h3>
          <p><strong>Amount Paid:</strong> ₹${data.order.pricing.total.toFixed(2)}</p>
          <p><strong>Payment Date:</strong> ${new Date(data.order.payment.paidAt).toLocaleDateString()}</p>
          <p><strong>Transaction ID:</strong> ${data.order.payment.razorpayPaymentId}</p>
        </div>

        <p>Your order is now confirmed and will be processed shortly. You'll receive a shipping notification once your order is dispatched.</p>
        
        ${data.invoiceUrl ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.invoiceUrl}" 
             style="background-color: #6366F1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Download Invoice
          </a>
        </div>
        ` : ''}

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Best regards,<br>
          The Abi Store Team
        </p>
      </div>
    `
  },

  orderCancellation: {
    subject: (data) => `Order Cancelled - ${data.order.orderNumber}`,
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #EF4444;">Order Cancelled</h2>
        <p>Hi ${data.name},</p>
        <p>Your order ${data.order.orderNumber} has been cancelled as requested.</p>
        
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #EF4444;">
          <h3 style="margin-top: 0;">Cancellation Details</h3>
          <p><strong>Reason:</strong> ${data.reason}</p>
          <p><strong>Cancelled On:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <p>If you paid for this order, your refund will be processed within 5-7 business days to your original payment method.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}" 
             style="background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Continue Shopping
          </a>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Best regards,<br>
          The Abi Store Team
        </p>
      </div>
    `
  }
};

// Send email function
const sendEmail = async ({ to, subject, template, data, attachments = [] }) => {
  try {
    const transporter = createTransporter();
    
    let emailContent;
    if (template && emailTemplates[template]) {
      const templateConfig = emailTemplates[template];
      emailContent = {
        subject: typeof templateConfig.subject === 'function' 
          ? templateConfig.subject(data) 
          : templateConfig.subject,
        html: templateConfig.html(data)
      };
    } else {
      emailContent = { subject, html: data.html || data.message };
    }

    const mailOptions = {
      from: `"Abi Store" <${process.env.EMAIL_USER}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      attachments
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Send bulk emails
const sendBulkEmail = async (recipients, { subject, template, data, attachments = [] }) => {
  try {
    const transporter = createTransporter();
    const promises = recipients.map(recipient => {
      return sendEmail({
        to: recipient.email,
        subject,
        template,
        data: { ...data, name: recipient.name },
        attachments
      });
    });

    const results = await Promise.allSettled(promises);
    
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    console.log(`Bulk email results: ${successful} successful, ${failed} failed`);
    return { successful, failed, results };
  } catch (error) {
    console.error('Bulk email sending failed:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendBulkEmail
};