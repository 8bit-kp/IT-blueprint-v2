import Blueprint from "../models/Blueprint.js";
import cache from "../utils/cache.js";

// Cache TTL in seconds for blueprint reads
const BLUEPRINT_TTL = parseInt(process.env.BLUEPRINT_CACHE_TTL || "60", 10);

export const saveBlueprint = async (req, res) => {
  try {
    const userId = req.user;
    const data = req.body;

    // Ensure the request is authenticated
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Validate required data structure
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ message: "Invalid data format" });
    }

    // Basic payload sanitization to avoid operator injection
    const hasInvalidKey = (obj) => {
      if (!obj || typeof obj !== 'object') return false;
      for (const key of Object.keys(obj)) {
        if (key.startsWith('$') || key.includes('.')) return true;
        const val = obj[key];
        if (typeof val === 'object') {
          if (hasInvalidKey(val)) return true;
        }
      }
      return false;
    };

    if (hasInvalidKey(data)) {
      return res.status(400).json({ message: "Invalid data keys detected" });
    }

    console.log(`Saving blueprint for user ${userId}. Payload keys: ${Object.keys(data).slice(0,20).join(', ')}. Size: ${JSON.stringify(data).length} bytes`);

    // Use updateOne for fast writes with validation
    await Blueprint.updateOne(
      { userId }, 
      { $set: data, $setOnInsert: { userId } }, 
      { upsert: true, runValidators: true }
    );

    // Invalidate cache for this user so subsequent reads fetch fresh data
    try {
      await cache.del(`blueprint:${userId}`);
    } catch (e) {
      // Non-fatal: caching errors shouldn't block API success
      console.warn("Cache delete failed:", e.message || e);
    }

    res.status(200).json({ 
      message: "Blueprint saved successfully",
      success: true
    });
  } catch (error) {
    console.error("saveBlueprint error:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    
    // Handle specific mongoose errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error: " + error.message,
        success: false 
      });
    }
    
    res.status(500).json({ 
      message: "Failed to save blueprint: " + error.message,
      success: false 
    });
  }
};

export const getBlueprint = async (req, res) => {
  try {
    const userId = req.user;
    
    console.log(`Fetching blueprint for user: ${userId}`);

    // Ensure the request is authenticated
    if (!userId) {
      console.error("getBlueprint: No userId found in request");
      return res.status(401).json({ message: "User not authenticated" });
    }

    const cacheKey = `blueprint:${userId}`;
    // Try cache first
    try {
      const cached = await cache.get(cacheKey);
      if (cached) {
        console.log(`Returning cached blueprint for user ${userId}`);
        return res.status(200).json(cached);
      }
    } catch (e) {
      // cache read failed; continue to DB
      console.warn("Cache get failed:", e.message || e);
    }

    // Use lean() to return plain JS object (faster and smaller)
    const blueprint = await Blueprint.findOne({ userId }).lean().select("-__v");

    const result = blueprint || {};
    
    console.log(`Blueprint fetched from DB for user ${userId}. Has data: ${!!blueprint}`);

    // Set cache asynchronously
    cache.set(cacheKey, result, BLUEPRINT_TTL).catch((err) => {
      console.warn("Cache set failed:", err.message || err);
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("getBlueprint error:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      message: "Failed to retrieve blueprint: " + error.message 
    });
  }
};
