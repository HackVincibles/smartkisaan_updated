const { Server } = require('socket.io');
const { ALLOWED_ORIGIN } = require('./config');

let io = null;

/**
 * initSocket — attach Socket.io to the HTTP server
 * Call once in index.js: initSocket(server)
 * Then import getIO() anywhere to emit events
 */
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [ALLOWED_ORIGIN, 'http://localhost:5173', 'http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // ── /tracking namespace ────────────────────────────────
  const tracking = io.of('/tracking');

  tracking.on('connection', (socket) => {
    console.log(`📡 Socket connected: ${socket.id}`);

    // Client joins a room for a specific order
    socket.on('join-order', (orderId) => {
      if (!orderId) return;
      socket.join(orderId);
      console.log(`📦 Socket ${socket.id} joined order room: ${orderId}`);
      socket.emit('joined', { orderId, message: 'Now tracking this order' });
    });

    // Client leaves a room
    socket.on('leave-order', (orderId) => {
      socket.leave(orderId);
      console.log(`📦 Socket ${socket.id} left order room: ${orderId}`);
    });

    socket.on('disconnect', () => {
      console.log(`📡 Socket disconnected: ${socket.id}`);
    });
  });

  console.log('✅ Socket.io initialized on /tracking namespace');
  return io;
};

/**
 * getIO — get the Socket.io instance from anywhere in the app
 * Used in logisticsController to emit location updates
 */
const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized. Call initSocket(server) first.');
  return io;
};

/**
 * emitLocationUpdate — emit GPS update to all clients watching an order
 * @param {string} orderId
 * @param {object} locationData { lat, lng, timestamp, status }
 */
const emitLocationUpdate = (orderId, locationData) => {
  try {
    if (!io) return;
    io.of('/tracking').to(orderId).emit('location', {
      orderId,
      ...locationData,
      timestamp: locationData.timestamp || new Date().toISOString(),
    });
  } catch (err) {
    console.error('[Socket emit error]', err.message);
  }
};

module.exports = { initSocket, getIO, emitLocationUpdate };
