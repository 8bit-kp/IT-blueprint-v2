import Blueprint from "../models/Blueprint.js";
import cache from "../utils/cache.js";

// Cache TTL in seconds for blueprint reads
const BLUEPRINT_TTL = parseInt(process.env.BLUEPRINT_CACHE_TTL || "60", 10);

export const saveBlueprint = async (req, res) => {
  try {
    const userId = req.user;
    const data = req.body;

    // Use updateOne for fast writes then read back using a lean query
    await Blueprint.updateOne({ userId }, { $set: data, $setOnInsert: { userId } }, { upsert: true });

    // Invalidate cache for this user so subsequent reads fetch fresh data
    try {
      await cache.del(`blueprint:${userId}`);
    } catch (e) {
      // Non-fatal: caching errors shouldn't block API success
      console.warn("Cache delete failed:", e.message || e);
    }

    res.status(200).json({ message: "Blueprint saved successfully" });
  } catch (error) {
    console.error("saveBlueprint error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getBlueprint = async (req, res) => {
  try {
    const userId = req.user;

    const cacheKey = `blueprint:${userId}`;
    // Try cache first
    try {
      const cached = await cache.get(cacheKey);
      if (cached) return res.status(200).json(cached);
    } catch (e) {
      // cache read failed; continue to DB
      console.warn("Cache get failed:", e.message || e);
    }

    // Use lean() to return plain JS object (faster and smaller)
    const blueprint = await Blueprint.findOne({ userId }).lean().select("-__v");

    const result = blueprint || {};

    // Set cache asynchronously
    cache.set(cacheKey, result, BLUEPRINT_TTL).catch((err) => {
      console.warn("Cache set failed:", err.message || err);
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("getBlueprint error:", error);
    res.status(500).json({ message: error.message });
  }
};
