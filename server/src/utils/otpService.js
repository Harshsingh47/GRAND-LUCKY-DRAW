const Notification = require('../models/Notification');
const { NOTIFICATION_TYPE } = require('../config/constants');

/**
 * Generates a 6-digit OTP
 */
const generateOtp = () => {
  if (process.env.NODE_ENV === 'test') {
    return '123456';
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Sends OTP to a participant mobile number
 */
const sendOtp = async (mobile, otp, purpose = 'Verification') => {
  const message = `Your Grand Lucky Draw verification code is: ${otp}. Valid for 5 minutes. Do not share with anyone. - Independent Medias`;
  
  console.log(`\n========================================`);
  console.log(`[SMS GATEWAY SIMULATION] To: ${mobile}`);
  console.log(`[MESSAGE]: ${message}`);
  console.log(`========================================\n`);

  // Persist to notification history
  try {
    await Notification.create({
      channel: 'SMS',
      recipient: mobile,
      type: NOTIFICATION_TYPE.OTP,
      title: `${purpose} OTP`,
      message,
      status: 'SENT',
      meta: { purpose, timestamp: new Date() }
    });
  } catch (err) {
    console.error('[Notification Log Error]', err.message);
  }

  return {
    success: true,
    message: 'OTP sent successfully',
    // In development mode, provide OTP in debug payload for easy testing
    debugOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
  };
};

/**
 * Sends SMS Notification
 */
const sendSmsNotification = async (mobile, message, type = NOTIFICATION_TYPE.REGISTRATION_CONFIRMATION) => {
  console.log(`[SMS NOTIFICATION] To: ${mobile} | ${message}`);
  
  try {
    await Notification.create({
      channel: 'SMS',
      recipient: mobile,
      type,
      message,
      status: 'SENT'
    });
  } catch (err) {
    console.error('[SMS Notification Error]', err.message);
  }
};

module.exports = {
  generateOtp,
  sendOtp,
  sendSmsNotification
};
