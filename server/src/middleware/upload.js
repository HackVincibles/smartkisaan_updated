const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// ─── Audio: memory storage (sent directly to HF Whisper) ─
const audioMemoryStorage = multer.memoryStorage();

const audioFilter = (req, file, cb) => {
  const allowed = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/flac', 'audio/ogg', 'audio/webm', 'audio/x-wav'];
  if (allowed.includes(file.mimetype) || file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed (wav, mp3, flac, ogg, webm)'), false);
  }
};

const uploadAudio = multer({
  storage: audioMemoryStorage,
  fileFilter: audioFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max for audio
}).single('audio');

// ─── Cloudinary Storage (images) ─────────────────────────────
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'smartkisan/listings',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 900, crop: 'limit', quality: 'auto' }],
  },
});

// ─── Cloudinary Storage (videos) ─────────────────────────────
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'smartkisan/listing-videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi'],
  },
});

// ─── File Filter ──────────────────────────────────────────────
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, jpeg, png, webp)'), false);
  }
};

const videoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed (mp4, mov, avi)'), false);
  }
};

// ─── Multer Upload Instances ──────────────────────────────────

// For listing images: up to 5 images
const uploadImages = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per image
}).array('images', 5);

// For listing videos: up to 2 videos
const uploadVideos = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB per video
}).array('videos', 2);

// For a single image (profile photo, etc.)
const uploadSingleImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('image');

// ─── Error handler wrapper ────────────────────────────────────
// Wraps multer middleware so errors return JSON instead of crashing
const handleUpload = (uploadMiddleware) => (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload failed',
        code: 'UPLOAD_ERROR',
      });
    }
    next();
  });
};

module.exports = {
  uploadImages: handleUpload(uploadImages),
  uploadVideos: handleUpload(uploadVideos),
  uploadSingleImage: handleUpload(uploadSingleImage),
  uploadAudio: handleUpload(uploadAudio),
};
