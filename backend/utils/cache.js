// Simple in-memory cache with TTL

const memory = new Map();

function setMemory(key, value, ttlSeconds = 60) {
  const expireAt = Date.now() + ttlSeconds * 1000;
  memory.set(key, { value, expireAt });
}

function getMemory(key) {
  const entry = memory.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expireAt) {
    memory.delete(key);
    return null;
  }
  return entry.value;
}

function delMemory(key) {
  memory.delete(key);
}

export default {
  async get(key) {
    return getMemory(key);
  },
  async set(key, value, ttlSeconds = 60) {
    setMemory(key, value, ttlSeconds);
  },
  async del(key) {
    delMemory(key);
  },
};
