const nodemailer = require('nodemailer');
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL } = require('../config/config');

// ── Setup Nodemailer Transport ─────────────────────
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

/**
 * @desc Central Communication Routing Hub
 */
const notify = {
  // 1. Send Email
  email: async (to, subject, html) => {
    try {
      if (!SMTP_USER) return console.log(`[SIMULATED EMAIL to ${to}] Subject: ${subject}`);

      await transporter.sendMail({
        from: `"SmartKisan Notification" <${FROM_EMAIL}>`,
        to,
        subject,
        html
      });
      console.log(`📨 Sent Email successfully to ${to}`);
    } catch (err) {
      console.error('Email Dispatch Failure:', err.message);
    }
  },

  // 2. Send SMS/WhatsApp (Simulated Integration Hook)
  sms: async (phone, message) => {
    // Placeholder for Twilio / Gupshup SMS API
    console.log(`📱 [SMS OUTBOUND to +91${phone}]: "${message}"`);
    return true;
  },

  // 3. Send Mobile Push Notification (FCM Simulated)
  push: async (userId, title, body) => {
    // Placeholder for Firebase Cloud Messaging (FCM) Dispatcher
    console.log(`🔔 [PUSH SENT to UserID:${userId}]: Title="${title}"`);
    return true;
  },

  // 4. Broadcast Global Broadcast
  broadcastOrderStatus: async (orderId, newState, participants) => {
    const msg = `Order Update: Your order #${orderId.toString().slice(-6)} has been moved to ${newState}.`;
    
    participants.forEach(async user => {
      await notify.push(user._id, '📦 Order Status Change', msg);
      if (user.phone) await notify.sms(user.phone, msg);
    });
  },

  // 5. General Notification Wrapper
  sendNotification: async (userId, title, body, metadata = {}) => {
    // For now, trigger both Push and SMS as a best effort
    await notify.push(userId, title, body);
    // Note: We'd normally lookup the user's phone here, but for broad use we expect push to be primary
  }
};

module.exports = notify;
