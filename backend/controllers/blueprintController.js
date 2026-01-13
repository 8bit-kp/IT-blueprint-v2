import Blueprint from "../models/Blueprint.js";

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

    // Use an atomic upsert to create or update the blueprint safely and run validators
    const updated = await Blueprint.findOneAndUpdate(
      { userId },
      { userId, ...data },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ 
      message: "Blueprint saved successfully",
      success: true,
      id: updated?._id
    });
  } catch (error) {
    console.error("Save blueprint error:", error);
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
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const blueprint = await Blueprint.findOne({ userId }).lean(); // Use lean() for better performance
    
    // Return empty structure if no blueprint found
    if (!blueprint) {
      return res.status(200).json({
        applications: {
          productivity: [],
          finance: [],
          hrit: [],
          payroll: [],
          additional: []
        }
      });
    }
    
    res.status(200).json(blueprint);
  } catch (error) {
    console.error("Get blueprint error:", error);
    res.status(500).json({ 
      message: "Failed to retrieve blueprint. Please try again.",
      error: error.message 
    });
  }
};
