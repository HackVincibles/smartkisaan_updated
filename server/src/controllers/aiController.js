const { sendSuccess, sendError } = require('../utils/responseHelper');
const { 
  runFullScan, 
  detectDisease, 
  suggestPrice, 
  base64ToBuffer, 
  imageUrlToBuffer,
  translateText,
  performFraudCheck,
  checkAIHealth
} = require('../services/aiService');
const { transcribeAudio, parseIntent } = require('../services/voiceService');
const AIScan = require('../models/AIScan');

// T82 — Analyze Crop
const analyzeCrop = async (req, res) => {
  try {
    let b64 = null;
    if (req.file?.buffer) b64 = req.file.buffer.toString('base64');
    else if (req.body.imageBase64) b64 = req.body.imageBase64;
    else if (req.body.imageUrl) {
      const buf = await imageUrlToBuffer(req.body.imageUrl);
      b64 = buf ? buf.toString('base64') : null;
    }

    if (!b64) return sendError(res, 'No image provided', 'MISSING_IMAGE', 400);

    const scanResult = await runFullScan(b64, req.body.crop);
    
    // Auto-save if linked
    if (req.body.listingId || req.body.orderId) {
      await AIScan.create({
        orderId: req.body.orderId || null,
        listingId: req.body.listingId || null,
        scanType: req.body.scanType || 'LISTING',
        aiGrade: scanResult.quality.grade,
        aiScore: scanResult.quality.score,
        scannedBy: req.user._id,
      });
    }

    return sendSuccess(res, scanResult, 'Crop analysis complete');
  } catch (error) {
    return sendError(res, 'AI Analysis failed', 'AI_ERR', 500);
  }
};

// T83 — Predict Price
const predictPrice = async (req, res) => {
  try {
    const { crop, grade, mandiRate } = req.body;
    if (!crop) return sendError(res, 'crop is required', 'MISSING_CROP', 400);
    const suggestion = await suggestPrice(crop, grade || 'B', mandiRate);
    return sendSuccess(res, suggestion, 'Price prediction successful');
  } catch (error) {
    return sendError(res, 'Prediction failed', 'AI_ERR', 500);
  }
};

// T84 — Translate
const translate = async (req, res) => {
  try {
    const { text, targetLang } = req.body;
    if (!text) return sendError(res, 'text is required', 'MISSING_TEXT', 400);
    const translated = await translateText(text, targetLang);
    return sendSuccess(res, { translated }, 'Translation successful');
  } catch (error) {
    return sendError(res, 'Translation failed', 'AI_ERR', 500);
  }
};

// T85 — Voice to Text
const voiceToText = async (req, res) => {
  try {
    if (!req.file?.buffer) return sendError(res, 'No audio uploaded', 'NO_AUDIO', 400);
    const transcription = await transcribeAudio(req.file.buffer);
    if (!transcription) return sendError(res, 'STT Failed', 'STT_ERR', 500);
    const intent = parseIntent(transcription.text);
    return sendSuccess(res, { transcript: transcription.text, ...intent }, 'Voice processed');
  } catch (error) {
    return sendError(res, 'Voice failed', 'AI_ERR', 500);
  }
};

// T86 — AI Health
const aiHealth = async (req, res) => {
  const health = await checkAIHealth();
  return sendSuccess(res, health, 'AI Service Health Status');
};

// T87 — Fraud Check
const fraudCheck = async (req, res) => {
  try {
    const result = await performFraudCheck(req.user._id, req.body);
    return sendSuccess(res, result, 'Fraud check completed');
  } catch (error) {
    return sendError(res, 'Check failed', 'ERR', 500);
  }
};

const getScanHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, scanType } = req.query;
    const filter = { scannedBy: req.user._id };
    if (scanType && typeof scanType === 'string') filter.scanType = scanType.toUpperCase();

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [scans, total] = await Promise.all([
      AIScan.find(filter)
        .populate('listingId', 'productName images')
        .populate('orderId', 'escrowState')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      AIScan.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      scans,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    }, 'Scan history fetched');
  } catch (error) {
    console.error('[getScanHistory]', error);
    return sendError(res, 'Failed to fetch scan history', 'FETCH_SCANS_FAILED', 500);
  }
};

module.exports = {
  analyzeCrop,
  predictPrice,
  translate,
  voiceToText,
  aiHealth,
  fraudCheck,
  getScanHistory,
  getAdvice: async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) return sendError(res, 'Query is required', 'MISSING_QUERY', 400);
      const { askAI } = require('../services/aiService');
      const advice = await askAI(query);
      return sendSuccess(res, { advice }, 'AI Advice fetched');
    } catch (error) {
      return sendError(res, 'Failed to get AI advice', 'AI_ERR', 500);
    }
  }
};
