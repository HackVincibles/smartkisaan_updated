const QRCode = require('qrcode');
const crypto = require('crypto');
const { JWT_SECRET } = require('../config/config');

// ─────────────────────────────────────────────────────────
// generateQRHash — creates a tamper-proof HMAC hash for a QR
// ─────────────────────────────────────────────────────────
const generateQRHash = (orderId, role) => {
  return crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${orderId}:${role}`)
    .digest('hex');
};

// ─────────────────────────────────────────────────────────
// generateQR
// Creates a base64 data URL QR code for farmer or buyer
//
// QR payload: { orderId, role, hash }
//   - hash is HMAC-signed so it cannot be forged without JWT_SECRET
//
// @param {string} orderId  - MongoDB Order _id
// @param {string} role     - 'farmer' | 'buyer'
// @returns {string} base64 data URL (starts with data:image/png;base64,...)
// ─────────────────────────────────────────────────────────
const generateQR = async (orderId, role) => {
  const hash = generateQRHash(orderId.toString(), role);

  const payload = JSON.stringify({
    orderId: orderId.toString(),
    role,
    hash,
    generatedAt: new Date().toISOString(),
  });

  const qrDataUrl = await QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: 300,
    margin: 2,
  });

  return qrDataUrl;
};

// ─────────────────────────────────────────────────────────
// verifyQR — T100
// @param {string} qrData — scanned JSON string
// @param {string} orderId — expected order id
// @param {string} scannerAgencyId — agency ID of the scanning device
// ─────────────────────────────────────────────────────────
const verifyQR = async (qrData, orderId, scannerAgencyId) => {
  try {
    const Order = require('../models/Order');
    const payload = JSON.parse(qrData);
    if (payload.orderId !== orderId.toString()) return { valid: false, error: 'Order mismatch' };
    
    // Verify HMAC hash
    const expectedHash = generateQRHash(payload.orderId, payload.role);
    if (payload.hash !== expectedHash) return { valid: false, error: 'Tampering detected' };

    // Verify scanner matches assigned agency
    const order = await Order.findById(orderId);
    if (!order) return { valid: false, error: 'Order not found' };
    
    if (order.agencyId && order.agencyId.toString() !== scannerAgencyId.toString()) {
      return { valid: false, error: 'Unassigned transporter' };
    }

    return { valid: true };
  } catch (err) {
    return { valid: false, error: 'Invalid QR' };
  }
};

// ─────────────────────────────────────────────────────────
// calculateDistance — T102
// ─────────────────────────────────────────────────────────
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ─────────────────────────────────────────────────────────
// assignTransporter — T101
// ─────────────────────────────────────────────────────────
const assignTransporter = async (orderId, farmerLocation, quantity) => {
  const TransportAgency = require('../models/TransportAgency');
  const agency = await TransportAgency.findOne({ isAvailable: true });
  return agency ? agency._id : null;
};

module.exports = { generateQR, verifyQR, calculateDistance, assignTransporter };
