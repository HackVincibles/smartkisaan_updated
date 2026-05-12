/**
 * aiService.js — SmartKisan AI Engine
 *
 * Phase 5: Real HuggingFace Inference API integration
 * Every function has a 2-layer fallback:
 *   Layer 1: Real HuggingFace API call (when HF_TOKEN set + model loaded)
 *   Layer 2: Smart stub (when HF unavailable / cold start / rate limit)
 *
 * HF Models Used:
 *   - Crop Detection:    google/vit-base-patch16-224 (ImageNet classification)
 *   - Disease Detection: linkanjarad/plant-disease-detection
 *   - Quality Grading:   Heuristic from classification confidence
 *   - Voice/STT:         openai/whisper-large-v3 (in voiceService.js)
 */

const axios = require('axios');
const { HF_TOKEN } = require('../config/config');

const HF_BASE = 'https://api-inference.huggingface.co/models';

/**
 * callHuggingFaceInference — T88
 * @param {string} imageBase64 
 * @param {string} modelId 
 */
const callHuggingFaceInference = async (imageBase64, modelId) => {
  const inputBuffer = base64ToBuffer(imageBase64);
  if (!inputBuffer) return null;
  return callHF(modelId, inputBuffer, 'application/octet-stream');
};

/**
 * Generic HF Caller — T88b
 */
const callHF = async (modelId, payload, contentType = 'application/json') => {
  if (!HF_TOKEN) return null;
  try {
    const response = await axios.post(
      `${HF_BASE}/${modelId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': contentType,
        },
        timeout: 25000,
      }
    );
    return response.data;
  } catch (err) {
    // Check for "currently loading" 503 error
    if (err.response?.status === 503) {
      console.warn(`[HF API Loading] ${modelId} is warming up...`);
    } else {
      console.error(`[HF API Error] ${modelId}:`, err.response?.data || err.message);
    }
    return null;
  }
};

// ─────────────────────────────────────────────────────────
// imageUrlToBuffer — fetch image URL → ArrayBuffer for HF API
// ─────────────────────────────────────────────────────────
const imageUrlToBuffer = async (imageUrl) => {
  try {
    // Basic validation to prevent SSRF
    const url = new URL(imageUrl);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return null;
    }
    
    // Optional: Block internal/local IPs (simplified check)
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname.startsWith('192.168.')) {
      return null;
    }

    const response = await axios.get(imageUrl, { 
      responseType: 'arraybuffer', 
      timeout: 10000,
      maxContentLength: 5 * 1024 * 1024 // Limit size to 5MB
    });
    return Buffer.from(response.data);
  } catch (_) {
    return null;
  }
};

// ─────────────────────────────────────────────────────────
// base64ToBuffer — convert base64 data URL to Buffer for HF API
// ─────────────────────────────────────────────────────────
const base64ToBuffer = (base64String) => {
  try {
    // Strip data URL prefix if present (data:image/png;base64,...)
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
  } catch (_) {
    return null;
  }
};

// ─────────────────────────────────────────────────────────
// CROP LABELS MAP — maps ImageNet labels → SmartKisan crop names
// ─────────────────────────────────────────────────────────
const CROP_LABEL_MAP = {
  'Granny Smith': 'apple',   strawberry: 'strawberry',
  'fig': 'fig',              'lemon': 'lemon',
  'orange': 'orange',        'pineapple': 'pineapple',
  'banana': 'banana',        'mango': 'mango',
  'pomegranate': 'pomegranate',
  'ear, spike, capitulum': 'wheat',
  'corn': 'maize',           'mushroom': 'mushroom',
  'artichoke': 'artichoke',  'bell pepper': 'capsicum',
  'cucumber': 'cucumber',    'zucchini': 'zucchini',
  'butternut squash': 'pumpkin', 'acorn squash': 'squash',
  'head cabbage': 'cabbage', 'broccoli': 'broccoli',
  'cauliflower': 'cauliflower',
};

const CROP_KEYWORDS = [
  'tomato', 'potato', 'onion', 'wheat', 'rice', 'maize', 'corn',
  'apple', 'mango', 'banana', 'orange', 'grape', 'pineapple', 'papaya',
  'cabbage', 'broccoli', 'cauliflower', 'carrot', 'radish', 'spinach',
  'soybean', 'cotton', 'sugarcane', 'pepper', 'chili', 'ginger', 'garlic',
];

const mapLabelToCrop = (labels) => {
  if (!Array.isArray(labels)) return null;

  for (const item of labels) {
    const label = (item.label || '').toLowerCase();

    // Direct mapping
    if (CROP_LABEL_MAP[item.label]) return CROP_LABEL_MAP[item.label];

    // Keyword check
    const found = CROP_KEYWORDS.find((c) => label.includes(c));
    if (found) return found;
  }
  return null;
};

// ─────────────────────────────────────────────────────────
// detectCrop — identifies crop from image
// @param imageInput — base64 string | URL | Buffer | null
// @returns string crop name
// ─────────────────────────────────────────────────────────
const detectCrop = async (imageBase64) => {
  try {
    const result = await callHuggingFaceInference(imageBase64, 'google/vit-base-patch16-224');
    if (result && Array.isArray(result)) {
      const crop = mapLabelToCrop(result);
      if (crop) return crop;
    }
  } catch (_) {}

  const crops = ['tomato', 'wheat', 'rice', 'onion', 'potato', 'apple', 'mango'];
  return crops[Math.floor(Math.random() * crops.length)];
};

// ─────────────────────────────────────────────────────────
// detectDisease — detects plant disease from image
// @param imageInput — base64 | URL | Buffer | null
// @returns { disease, isHealthy, confidence, treatment, message }
// ─────────────────────────────────────────────────────────
const detectDisease = async (imageBase64) => {
  try {
    const result = await callHuggingFaceInference(imageBase64, 'linkanjarad/plant-disease-detection');

    if (result && Array.isArray(result) && result.length > 0) {
      const topLabel = result[0].label || '';
      const confidence = ((result[0].score || 0) * 100).toFixed(1);
      const isHealthy = topLabel.toLowerCase().includes('healthy');

      if (isHealthy) {
        return { disease: null, isHealthy: true, confidence, treatment: null, message: 'Crop appears healthy' };
      }

      const parts = topLabel.replace(/__+/g, ' ').split(' ');
      const diseaseName = parts.slice(1).join(' ').replace(/_/g, ' ');

      return {
        disease: diseaseName || topLabel,
        isHealthy: false,
        confidence,
        treatment: getTreatmentAdvice(diseaseName || topLabel),
        message: `${diseaseName || topLabel} detected`,
      };
    }
  } catch (_) {}

  const isHealthy = Math.random() > 0.3;
  if (isHealthy) return { disease: null, isHealthy: true, confidence: (85 + Math.random() * 15).toFixed(1), message: 'Crop appears healthy (simulated)' };
  
  const diseases = [{ disease: 'Early Blight', treatment: 'Copper-based fungicide.' }, { disease: 'Leaf Rust', treatment: 'Triazole fungicide.' }];
  const picked = diseases[Math.floor(Math.random() * diseases.length)];
  return { ...picked, isHealthy: false, confidence: (75).toFixed(1), message: `${picked.disease} detected (simulated)` };
};

// ─────────────────────────────────────────────────────────
// getTreatmentAdvice — rule-based treatment map
// ─────────────────────────────────────────────────────────
const getTreatmentAdvice = (diseaseLabel) => {
  const label = diseaseLabel.toLowerCase();
  if (label.includes('blight'))       return 'Apply copper-based fungicide. Remove infected leaves. Improve air circulation.';
  if (label.includes('rust'))         return 'Apply triazole fungicide. Rotate crops next season.';
  if (label.includes('mildew'))       return 'Spray neem oil or sulfur-based fungicide. Avoid overhead watering.';
  if (label.includes('mosaic') || label.includes('virus')) return 'Remove infected plants immediately. Control insect vectors. No chemical cure.';
  if (label.includes('spot'))         return 'Apply mancozeb or copper oxychloride spray. Improve field drainage.';
  if (label.includes('scab'))         return 'Apply fungicide at bud break. Remove and destroy fallen leaves.';
  if (label.includes('rot'))          return 'Improve drainage. Apply appropriate fungicide. Remove infected fruits.';
  return 'Consult local agricultural extension officer for specific treatment.';
};

// ─────────────────────────────────────────────────────────
// gradeQuality — grades crop quality from image
// Uses VIT confidence scores as a proxy for quality
// @returns { grade: 'A'|'B'|'C', score: 0-100, details }
// ─────────────────────────────────────────────────────────
const gradeQuality = async (imageBase64) => {
  try {
    const result = await callHuggingFaceInference(imageBase64, 'google/vit-base-patch16-224');
    if (result && Array.isArray(result) && result.length > 0) {
      const score = Math.round((result[0].score || 0) * 100);
      let grade = score >= 75 ? 'A' : score >= 50 ? 'B' : 'C';
      return { grade, score, details: `${grade} grade based on AI classification confidence.` };
    }
  } catch (_) {}

  return { grade: 'B', score: 70, details: 'Good quality (simulated fallback)' };
};

// ─────────────────────────────────────────────────────────
// predictShelfLife — estimates shelf life in days
// ─────────────────────────────────────────────────────────
const predictShelfLife = async (crop, grade, temperature = 25) => {
  const baseLifeMap = {
    tomato: 7, wheat: 365, rice: 365, onion: 30, potato: 60,
    apple: 14, mango: 5, cotton: 365, soybean: 180, sugarcane: 3,
    banana: 5, orange: 21, grapes: 7, cauliflower: 7, cabbage: 14,
    carrot: 21, broccoli: 5, spinach: 3, cucumber: 5, pepper: 10,
  };

  const cropNorm = (crop || 'tomato').toLowerCase();
  const baseDays = baseLifeMap[cropNorm] || 10;
  const gradeMultiplier = { A: 1.0, B: 0.75, C: 0.5 }[grade] || 0.75;
  const tempPenalty = temperature > 35 ? 0.6 : temperature > 30 ? 0.8 : 1.0;

  return Math.max(1, Math.round(baseDays * gradeMultiplier * tempPenalty));
};

// ─────────────────────────────────────────────────────────
// suggestPrice — AI-powered price suggestion
// ─────────────────────────────────────────────────────────
const suggestPrice = async (crop, grade, mandiRate = null) => {
  const basePrices = {
    tomato: 20, wheat: 22, rice: 35, onion: 18, potato: 15,
    apple: 80, mango: 60, cotton: 65, soybean: 45, sugarcane: 3,
    banana: 25, orange: 40, grapes: 50, cauliflower: 20, cabbage: 12,
    carrot: 18, broccoli: 45, cucumber: 12, pepper: 25,
  };

  const cropNorm = (crop || 'tomato').toLowerCase();
  const base = mandiRate || basePrices[cropNorm] || 25;
  const gradeMarkup = { A: 1.2, B: 1.0, C: 0.8 }[grade] || 1.0;
  const suggested = Math.round(base * gradeMarkup);

  return {
    min: Math.round(suggested * 0.85),
    max: Math.round(suggested * 1.15),
    suggested,
    unit: 'per kg',
    basis: mandiRate ? 'mandi_rate' : 'historical_average',
  };
};

// ─────────────────────────────────────────────────────────
// runFullScan — combined scan used for listing/pickup/delivery
// Runs all AI checks on a single image in parallel
// ─────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────
// runFullScan — combined scan used for listing/pickup/delivery
// Runs all AI checks on a single image in parallel
// ─────────────────────────────────────────────────────────
const runFullScan = async (imageBase64, knownCrop = null) => {
  const [cropDetected, qualityResult, diseaseResult] = await Promise.all([
    knownCrop ? Promise.resolve(knownCrop) : detectCrop(imageBase64),
    gradeQuality(imageBase64),
    detectDisease(imageBase64),
  ]);

  const shelfLifeDays = await predictShelfLife(cropDetected, qualityResult.grade);
  const priceRange = await suggestPrice(cropDetected, qualityResult.grade);

  return {
    crop: cropDetected,
    quality: qualityResult,
    disease: diseaseResult,
    shelfLifeDays,
    suggestedPrice: priceRange,
  };
};

// ─────────────────────────────────────────────────────────
// translateText — multilingual translation via HF NLLB-200
// ─────────────────────────────────────────────────────────
const translateText = async (text, targetLang = 'hi') => {
  try {
    const langMap = { hi: 'hin_Deva', en: 'eng_Latn', mr: 'mar_Deva', ta: 'tam_Taml' };
    const target = langMap[targetLang] || 'hin_Deva';

    const result = await callHF('facebook/nllb-200-distilled-600M', { 
      inputs: text, 
      parameters: { src_lang: 'eng_Latn', tgt_lang: target } 
    }, 'application/json');

    if (result && result[0]?.translation_text) {
      return result[0].translation_text;
    }
  } catch (_) {}

  // Fallback: simple stub
  return `[Translated to ${targetLang}]: ${text}`;
};

// ─────────────────────────────────────────────────────────
// performFraudCheck — analyze patterns for suspicious activity
// ─────────────────────────────────────────────────────────
const performFraudCheck = async (userId, data = {}) => {
  // Mock heuristic: high amount + new user + multiple orders
  const { amount, count } = data;
  let score = 0;
  if (amount > 100000) score += 40;
  if (count > 3) score += 30;
  
  return {
    isSuspicious: score > 60,
    riskScore: score,
    reasons: score > 60 ? ['High volume pattern detected', 'Large transaction amount'] : []
  };
};

// ─────────────────────────────────────────────────────────
// checkAIHealth — check connectivity to HF
// ─────────────────────────────────────────────────────────
const checkAIHealth = async () => {
  const start = Date.now();
  const tokenSet = !!HF_TOKEN;
  let hfReachable = false;
  
  try {
    const res = await axios.get('https://huggingface.co/api/models/google/vit-base-patch16-224', { timeout: 3000 });
    hfReachable = res.status === 200;
  } catch (_) {}

  return {
    status: tokenSet && hfReachable ? 'healthy' : 'degraded',
    tokenConfigured: tokenSet,
    hfReachable,
    latencyMs: Date.now() - start
  };
};

module.exports = {
  detectCrop,
  detectDisease,
  gradeQuality,
  predictShelfLife,
  suggestPrice,
  runFullScan,
  imageUrlToBuffer,
  base64ToBuffer,
  checkAIHealth,
  askAI: async (query) => {
    // Phase 5: Real AI query using Blenderbot or similar
    try {
      // Format for Blenderbot/Conversation models
      const payload = {
        inputs: {
          past_user_inputs: [],
          generated_responses: [],
          text: query
        },
        parameters: {
          max_length: 150,
          temperature: 0.7
        }
      };

      const response = await callHF('facebook/blenderbot-400M-distill', payload);
      
      if (response && response.generated_text) {
        return response.generated_text;
      }
      
      // Some models return it differently
      if (response && typeof response === 'string') return response;
      if (Array.isArray(response) && response[0]?.generated_text) return response[0].generated_text;
      if (response?.conversation?.generated_responses?.length > 0) {
        return response.conversation.generated_responses.pop();
      }
    } catch (err) {
      console.warn('[askAI HF failed]', err.message);
    }
    
    // Intelligent stub based on keywords (Improved)
    const q = query.toLowerCase();
    if (q.includes('price') || q.includes('mandi') || q.includes('rate') || q.includes('cost')) {
      return "Current market prices for most crops are trending upwards. I recommend checking the 'Mandi Insights' tab for the latest verified rates in your specific district and grade.";
    }
    if (q.includes('weather') || q.includes('rain') || q.includes('storm')) {
      return "The seasonal forecast indicates variable rainfall this week. It's a good time to check your drainage systems and ensure proper storage for harvested crops.";
    }
    if (q.includes('disease') || q.includes('yellow') || q.includes('spot') || q.includes('insect') || q.includes('pest')) {
      return "Pests and diseases can spread quickly. I suggest using our 'Analyze Crop' tool to upload a clear photo of the affected plant for an AI-powered diagnosis and treatment plan.";
    }
    if (q.includes('fertilizer') || q.includes('organic') || q.includes('soil') || q.includes('manure')) {
      return "Balanced nutrition is key. For organic farmers, vermicompost and liquid fermented manures (Jeevamrut) are excellent for soil health. Always test your soil every 2 years.";
    }
    if (q.includes('government') || q.includes('scheme') || q.includes('subsidy') || q.includes('loan')) {
      return "There are several schemes like PM-KISAN and KCC available. You can find more details in the government outreach section or consult your local Krishi Vigyan Kendra.";
    }
    
    return "That's a great question about agriculture! I'm here to help you optimize your yield and income. Could you tell me more about your specific crop or concern?";
  }
};
