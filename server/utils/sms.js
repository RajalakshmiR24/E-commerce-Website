const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send SMS function
const sendSMS = async ({ to, message }) => {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.log('SMS simulation (Twilio not configured):', { to, message });
      return { success: true, simulation: true };
    }

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });

    console.log('SMS sent successfully:', result.sid);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('SMS sending failed:', error);
    throw error;
  }
};

// Send OTP via SMS
const sendOTP = async ({ to, otp, purpose = 'verification' }) => {
  const messages = {
    verification: `Your Abi Store verification code is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`,
    passwordReset: `Your Abi Store password reset code is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`,
    orderUpdate: `Your Abi Store order update code is: ${otp}. Valid for 5 minutes.`
  };

  const message = messages[purpose] || messages.verification;
  
  return await sendSMS({ to, message });
};

// Send order notification SMS
const sendOrderNotification = async ({ to, orderNumber, status, trackingNumber = null }) => {
  let message;
  
  switch (status) {
    case 'confirmed':
      message = `Your Abi Store order ${orderNumber} has been confirmed! We'll notify you when it ships.`;
      break;
    case 'shipped':
      message = `Great news! Your order ${orderNumber} has been shipped. ${trackingNumber ? `Tracking: ${trackingNumber}` : 'Check your email for tracking details.'}`;
      break;
    case 'delivered':
      message = `Your order ${orderNumber} has been delivered! Thank you for shopping with Abi Store.`;
      break;
    case 'cancelled':
      message = `Your order ${orderNumber} has been cancelled. Any payment will be refunded within 5-7 business days.`;
      break;
    default:
      message = `Your order ${orderNumber} status has been updated to: ${status}`;
  }

  return await sendSMS({ to, message });
};

// Send promotional SMS
const sendPromotionalSMS = async ({ to, message, unsubscribeLink }) => {
  const fullMessage = `${message}\n\nTo unsubscribe: ${unsubscribeLink}`;
  return await sendSMS({ to, message: fullMessage });
};

module.exports = {
  sendSMS,
  sendOTP,
  sendOrderNotification,
  sendPromotionalSMS
};