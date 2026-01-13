import Blueprint from "../models/Blueprint.js";

export const saveBlueprint = async (req, res) => {
  try {
    const userId = req.user;
    const data = req.body;

    // Validate required data structure
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ message: "Invalid data format" });
    }

    const existing = await Blueprint.findOne({ userId });
    
    if (existing) {
      // Update existing blueprint
      await Blueprint.updateOne(
        { userId }, 
        { $set: data },
        { runValidators: true } // Ensure data validation on update
      );
      return res.status(200).json({ 
        message: "Blueprint updated successfully",
        success: true 
      });
    }

    // Create new blueprint
    const blueprint = new Blueprint({ userId, ...data });
    await blueprint.save();

    res.status(201).json({ 
      message: "Blueprint saved successfully",
      success: true 
    });
  } catch (error) {
    console.error("Save blueprint error:", error);
    
    // Handle specific mongoose errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error: " + error.message,
        success: false 
      });
    }
    
    res.status(500).json({ 
      message: "Failed to save blueprint. Please try again.",
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
