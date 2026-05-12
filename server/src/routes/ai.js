const express = require('express');
const router = express.Router();

const {
  analyzeCrop,
  predictPrice,
  translate,
  voiceToText,
  aiHealth,
  fraudCheck,
  getAdvice
} = require('../controllers/aiController');

const { protect } = require('../middleware/auth');
const { uploadSingleImage, uploadAudio } = require('../middleware/upload');

router.use(protect);

router.post('/analyze-crop',   uploadSingleImage,  analyzeCrop);
router.post('/predict-price',                      predictPrice);
router.post('/translate',                          translate);
router.post('/voice-to-text',  uploadAudio,        voiceToText);
router.get('/health',                              aiHealth);
router.post('/fraud-check',                        fraudCheck);
router.post('/advice',                             getAdvice);

module.exports = router;
