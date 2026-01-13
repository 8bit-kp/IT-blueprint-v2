// Cache abstraction: uses Redis if available and REDIS_URL is set, otherwise in-memory

let client = null;
let useRedis = false;
let redisInitialized = false;

// Initialize Redis lazily
async function initRedis() {
  if (redisInitialized) return;
  redisInitialized = true;

  if (!process.env.REDIS_URL) {
    console.log("ℹ️  No REDIS_URL set, using in-memory cache");
    return;
  }

  try {
    // Try to dynamically import ioredis if available
    const { default: Redis } = await import("ioredis");
    client = new Redis(process.env.REDIS_URL, {
      retryStrategy: (times) => {
        if (times > 3) {
          console.warn("⚠️  Redis connection failed, falling back to in-memory cache");
          useRedis = false;
          return null;
        }
        return Math.min(times * 100, 3000);
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    });

    await client.connect();
    useRedis = true;
    
    client.on("error", (err) => {
      console.warn("Redis error:", err.message);
      useRedis = false;
    });
    
    client.on("ready", () => {
      console.log("✅ Redis cache connected");
    });
  } catch (err) {
    console.warn("⚠️  Redis not available (ioredis not installed or connection failed), using in-memory cache");
    useRedis = false;
  }
}

// In-memory cache fallback
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
    await initRedis();
    if (useRedis && client) {
      try {
        const res = await client.get(key);
        return res ? JSON.parse(res) : null;
      } catch (err) {
        console.warn("Redis get error, using memory:", err.message);
        return getMemory(key);
      }
    }
    return getMemory(key);
  },
  
  async set(key, value, ttlSeconds = 60) {
    await initRedis();
    if (useRedis && client) {
      try {
        await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
        return;
      } catch (err) {
        console.warn("Redis set error, using memory:", err.message);
      }
    }
    setMemory(key, value, ttlSeconds);
  },
  
  async del(key) {
    await initRedis();
    if (useRedis && client) {
      try {
        await client.del(key);
        return;
      } catch (err) {
        console.warn("Redis del error, using memory:", err.message);
      }
    }
    delMemory(key);
  },
};
