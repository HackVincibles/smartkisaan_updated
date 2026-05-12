const Redis = require('ioredis'); // ioredis is already installed
const { REDIS_URL } = require('./config');

// ─── In-memory fallback (when Redis not available) ────────
const memoryStore = {};

const memSet = (key, ttlSeconds, value) => {
  memoryStore[key] = { value, expiresAt: Date.now() + ttlSeconds * 1000 };
};

const memGet = (key) => {
  const entry = memoryStore[key];
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { delete memoryStore[key]; return null; }
  return entry.value;
};

// ─── Try to connect to Redis ──────────────────────────────
let client = null;
let useMemory = false;

try {
  client = new Redis(REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    connectTimeout: 3000,
    enableOfflineQueue: false,
  });

  client.on('connect', () => console.log('✅ Redis Connected'));
  client.on('error', () => { useMemory = true; });

  client.connect().catch(() => { useMemory = true; });
} catch (_) {
  useMemory = true;
  console.warn('⚠️  Redis unavailable — using in-memory fallback for location cache');
}

// ─── Exported helpers ─────────────────────────────────────

const setEx = async (key, ttlSeconds, value) => {
  if (useMemory || !client) {
    memSet(key, ttlSeconds, value);
    return;
  }
  try {
    await client.set(key, value, 'EX', ttlSeconds);
  } catch (_) {
    memSet(key, ttlSeconds, value);
  }
};

const get = async (key) => {
  if (useMemory || !client) return memGet(key);
  try {
    return await client.get(key);
  } catch (_) {
    return memGet(key);
  }
};

const del = async (key) => {
  if (useMemory || !client) { delete memoryStore[key]; return; }
  try {
    await client.del(key);
  } catch (_) {
    delete memoryStore[key];
  }
};

module.exports = { setEx, get, del };
