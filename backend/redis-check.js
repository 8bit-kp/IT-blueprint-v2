/*
  Simple Redis/cache connectivity check. Run from backend folder:
    node redis-check.js
  It will attempt to set/get a test key using the cache abstraction.
*/
import cache from "./utils/cache.js";

async function run() {
  try {
    const key = `health:${Date.now()}`;
    await cache.set(key, { ok: true, ts: Date.now() }, 10);
    const val = await cache.get(key);
    console.log("Cache test value:", val);
    await cache.del(key);
    console.log("Cache OK");
    process.exit(0);
  } catch (err) {
    console.error("Cache test failed:", err);
    process.exit(2);
  }
}

run();
