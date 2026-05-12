/**
 * voiceService.js — SmartKisan Voice Processing
 *
 * Uses HuggingFace Whisper (openai/whisper-large-v3) for speech-to-text
 * Supports: Hindi, English, Marathi, Punjabi, Telugu, Tamil, Kannada
 *
 * Intent Parser — extracts structured commands from transcribed text
 * Recognized intents:
 *   - create_listing  → farmer wants to sell something
 *   - check_price     → wants mandi/market rate
 *   - check_orders    → wants order status
 *   - disease_check   → crop disease question
 *   - check_balance   → wallet balance
 *   - find_buyer      → looking for buyers
 *   - unknown         → fallback
 */

const axios = require('axios');
const { HF_TOKEN } = require('../config/config');

const WHISPER_MODEL = 'openai/whisper-large-v3';
const HF_BASE = 'https://api-inference.huggingface.co/models';

// ─────────────────────────────────────────────────────────
// transcribeAudio — Speech to Text via HuggingFace Whisper
//
// @param audioBuffer — Buffer of audio (mp3, wav, flac, ogg, webm)
// @returns { text, language, duration } | null on failure
// ─────────────────────────────────────────────────────────
const transcribeAudio = async (audioBuffer) => {
  if (!HF_TOKEN) {
    console.warn('⚠️  HF_TOKEN not set. Voice transcription unavailable.');
    return null;
  }

  try {
    const response = await axios.post(
      `${HF_BASE}/${WHISPER_MODEL}`,
      audioBuffer,
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'audio/wav', // Whisper accepts wav, mp3, flac
        },
        timeout: 60000, // Voice processing can take longer
        responseType: 'json',
        params: {
          return_timestamps: false,
        },
      }
    );

    const data = response.data;
    // Whisper returns: { text: "...", chunks: [...] }
    return {
      text: data.text?.trim() || '',
      language: data.language || 'unknown',
      chunks: data.chunks || [],
    };
  } catch (err) {
    if (err.response?.status === 503) {
      console.warn('⚠️  Whisper model loading (503). Retrying in 20s...');
      // Retry once after cold-start delay
      await new Promise((r) => setTimeout(r, 20000));
      return transcribeAudio(audioBuffer); // single retry
    }
    console.error('[transcribeAudio]', err.response?.data || err.message);
    return null;
  }
};

// ─────────────────────────────────────────────────────────
// INTENT KEYWORDS — multilingual keyword map
// Hindi, English, Marathi, Punjabi keywords
// ─────────────────────────────────────────────────────────
const INTENT_MAP = {
  create_listing: {
    keywords: [
      // English
      'sell', 'list', 'post', 'upload', 'add listing', 'create listing', 'want to sell',
      // Hindi
      'बेचना', 'बेचना है', 'लिस्ट करना', 'बेचूंगा', 'माल बेचना',
      // Marathi
      'विकायचे', 'विक', 'माल विकायचा',
      // Punjabi
      'ਵੇਚਣਾ', 'ਫ਼ਸਲ ਵੇਚਣੀ',
    ],
    response: 'I can help you sell your crop. What product would you like to list?',
    hindiResponse: 'मैं आपकी फसल बेचने में मदद करूंगा। आप क्या बेचना चाहते हैं?',
  },

  check_price: {
    keywords: [
      // English
      'price', 'rate', 'market rate', 'mandi rate', 'how much', 'value', 'cost',
      // Hindi
      'भाव', 'दाम', 'कीमत', 'मंडी भाव', 'क्या भाव है', 'रेट', 'बाजार भाव',
      // Marathi
      'भाव काय', 'किंमत', 'बाजारभाव',
      // Punjabi
      'ਭਾਅ', 'ਕੀਮਤ', 'ਮੰਡੀ ਭਾਅ',
    ],
    response: 'Let me check the current market rate for you.',
    hindiResponse: 'मैं आपके लिए मंडी का भाव देख रहा हूं।',
  },

  check_orders: {
    keywords: [
      'order', 'orders', 'my order', 'order status', 'delivery', 'shipment',
      'ऑर्डर', 'मेरा ऑर्डर', 'डिलीवरी', 'स्थिति',
      'ऑर्डर काय', 'माझे ऑर्डर',
    ],
    response: 'Let me fetch your current orders.',
    hindiResponse: 'मैं आपके ऑर्डर की जानकारी ला रहा हूं।',
  },

  disease_check: {
    keywords: [
      'disease', 'sick', 'problem', 'dying', 'damaged', 'infected', 'pest', 'spray', 'treatment',
      'रोग', 'बीमारी', 'कीड़ा', 'कीट', 'नुकसान', 'सड़ना', 'पत्ते पीले', 'दवाई',
      'रोग कसला', 'किडा', 'नुकसान',
    ],
    response: 'I can help diagnose your crop. Please take a clear photo of the affected area.',
    hindiResponse: 'मैं आपकी फसल की बीमारी पहचानने में मदद करूंगा। प्रभावित हिस्से की फोटो लें।',
  },

  check_balance: {
    keywords: [
      'balance', 'wallet', 'money', 'funds', 'account', 'payment',
      'बैलेंस', 'पैसे', 'वॉलेट', 'खाता', 'पेमेंट', 'पैसा',
      'बॅलन्स', 'पैसे किती',
    ],
    response: 'Let me check your wallet balance.',
    hindiResponse: 'मैं आपका बैलेंस देख रहा हूं।',
  },

  find_buyer: {
    keywords: [
      'buyer', 'buyers', 'find buyer', 'who wants', 'customer', 'demand',
      'खरीदार', 'ग्राहक', 'कौन खरीदेगा', 'खरीदार ढूंढो',
      'खरेदीदार', 'ग्राहक कोण',
    ],
    response: 'Let me find active buyers for your crop.',
    hindiResponse: 'मैं आपकी फसल के लिए खरीदार ढूंढ रहा हूं।',
  },
};

// ─────────────────────────────────────────────────────────
// parseIntent — extract structured intent from transcribed text
//
// @param {string} text — transcribed text from Whisper
// @returns {object} { intent, confidence, entities, response }
// ─────────────────────────────────────────────────────────
const parseIntent = (text) => {
  if (!text) return { intent: 'unknown', confidence: 0, entities: {}, response: 'I could not understand. Please try again.' };

  const lower = text.toLowerCase();
  let bestMatch = { intent: 'unknown', count: 0 };

  for (const [intent, config] of Object.entries(INTENT_MAP)) {
    const matchCount = config.keywords.filter((k) => lower.includes(k.toLowerCase())).length;
    if (matchCount > bestMatch.count) {
      bestMatch = { intent, count: matchCount };
    }
  }

  const confidence = Math.min(100, bestMatch.count * 30); // 1 match = 30%, 3+ = 90%+

  // ── Entity extraction ─────────────────────────────────
  const entities = extractEntities(lower);

  const intentConfig = INTENT_MAP[bestMatch.intent];
  const isHindi = /[\u0900-\u097F]/.test(text); // detect Devanagari script

  return {
    intent: bestMatch.intent,
    confidence,
    entities,
    response: isHindi
      ? (intentConfig?.hindiResponse || intentConfig?.response || 'मैं समझ नहीं पाया। कृपया दोबारा बोलें।')
      : (intentConfig?.response || 'I could not understand. Please try again.'),
    originalText: text,
    language: isHindi ? 'hi' : 'en',
  };
};

// ─────────────────────────────────────────────────────────
// extractEntities — pull out crop names, quantities, numbers
// ─────────────────────────────────────────────────────────
const extractEntities = (text) => {
  const entities = {};

  // Crop name detection
  const crops = ['tomato', 'wheat', 'rice', 'onion', 'potato', 'apple', 'mango',
    'टमाटर', 'गेहूं', 'चावल', 'प्याज', 'आलू', 'सेब', 'आम', 'कपास', 'सोयाबीन',
    'cotton', 'soybean', 'banana', 'orange', 'carrot', 'cabbage'];

  const foundCrop = crops.find((c) => text.includes(c.toLowerCase()));
  if (foundCrop) entities.crop = foundCrop;

  // Quantity (number + unit)
  const quantityMatch = text.match(/(\d+)\s*(kg|quintal|ton|किलो|क्विंटल)/i);
  if (quantityMatch) {
    entities.quantity = parseInt(quantityMatch[1]);
    entities.unit = quantityMatch[2];
  }

  // Price hint
  const priceMatch = text.match(/(\d+)\s*(rupee|rs|₹|रुपए|रुपये)/i);
  if (priceMatch) entities.priceHint = parseInt(priceMatch[1]);

  return entities;
};

module.exports = { transcribeAudio, parseIntent, extractEntities };
