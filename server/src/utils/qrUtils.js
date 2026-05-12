const QRCode = require('qrcode');

/**
 * T130 — QR Utils
 */
const generateQRDataURL = async (data) => {
  try {
    const payload = typeof data === 'string' ? data : JSON.stringify(data);
    return await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      width: 300,
      margin: 2
    });
  } catch (err) {
    console.error('[QRUtils Error]:', err.message);
    throw err;
  }
};

module.exports = { generateQRDataURL };
