require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const http = require('http');
const logger = require('./config/logger'); // Phase 12 ✅

const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');
const { PORT, ALLOWED_ORIGIN, NODE_ENV } = require('./config/config');

// ─── Import Routes ───────────────────────────
const authRoutes = require('./routes/auth');
const farmerRoutes = require('./routes/farmer');       // Phase 2 ✅
const buyerRoutes = require('./routes/buyer');          // Phase 2 ✅
const logisticsRoutes = require('./routes/logistics'); // Phase 3 ✅
const paymentRoutes = require('./routes/payments');    // Phase 4 ✅
const walletRoutes = require('./routes/wallet');       // Phase 4 Ext ✅
const aiRoutes = require('./routes/ai');               // Phase 5 ✅
const disputeRoutes = require('./routes/disputes');  // Phase 6 ✅
const ratingRoutes = require('./routes/ratings');    // Phase 7 ✅
const adminRoutes = require('./routes/admin');       // Phase 8 ✅

// ─── App Setup ───────────────────────────────
const app = express();
const server = http.createServer(app);

// ─── Initialize Socket.io ──────────────────
initSocket(server);

// ─── Connect to MongoDB ───────────────────────
connectDB();

// ─── Middleware ───────────────────────────────
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

app.use('/api/', limiter);

app.use(
  cors({
    origin: [ALLOWED_ORIGIN, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// Parse JSON and URL-encoded bodies
app.use(express.json({ limit: '10mb' })); // 10mb for base64 image uploads
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🌾 SmartKisan API is running',
    version: '1.0.0',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.json({ success: true, status: 'healthy', uptime: process.uptime() });
});

// ─── Upload Endpoint (global, requires auth) ──
const { uploadSingleImage } = require('./middleware/upload');
const { protect } = require('./middleware/auth');
app.post('/api/v1/upload', protect, uploadSingleImage, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded', code: 'NO_FILE' });
  }
  return res.json({ success: true, data: { url: req.file.path, publicId: req.file.filename }, message: 'File uploaded' });
});

// ─── API Routes ───────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/farmer', farmerRoutes);       // Phase 2 ✅
app.use('/api/v1/buyer', buyerRoutes);          // Phase 2 ✅
app.use('/api/v1/logistics', logisticsRoutes); // Phase 3 ✅
app.use('/api/v1/payments', paymentRoutes);    // Phase 4 ✅
app.use('/api/v1/wallet', walletRoutes);       // Phase 4 Ext ✅
app.use('/api/v1/ai', aiRoutes);               // Phase 5 ✅
app.use('/api/v1/disputes', disputeRoutes);  // Phase 6 ✅
app.use('/api/v1/ratings', ratingRoutes);    // Phase 7 ✅
app.use('/api/v1/admin', adminRoutes);       // Phase 8 ✅

// ─── 404 Handler ─────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
    code: 'ROUTE_NOT_FOUND',
  });
});

// ─── Global Error Handler ─────────────────────
app.use((err, req, res, next) => {
  logger.error(err); // Record full backtrace efficiently 
  res.status(500).json({
    success: false,
    error: NODE_ENV === 'production' ? 'Internal server error' : err.message,
    code: 'INTERNAL_ERROR',
  });
});

// ─── Start Server ─────────────────────────────
server.listen(PORT, () => {
  console.log(`\n🚀 SmartKisan backend running on port ${PORT}`);
  console.log(`📌 Environment: ${NODE_ENV}`);
  console.log(`🌐 Health: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/v1/auth\n`);
});

// ─── Export for tests ─────────────────────────
module.exports = { app, server };
