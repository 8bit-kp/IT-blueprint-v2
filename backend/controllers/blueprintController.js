import Blueprint from "../models/Blueprint.js";

export const saveBlueprint = async (req, res) => {
  try {
    const userId = req.user;
    const data = req.body;

    const existing = await Blueprint.findOne({ userId });
    if (existing) {
      await Blueprint.updateOne({ userId }, { $set: data });
      return res.status(200).json({ message: "Blueprint updated successfully" });
    }

    const blueprint = new Blueprint({ userId, ...data });
    await blueprint.save();

    res.status(201).json({ message: "Blueprint saved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlueprint = async (req, res) => {
  try {
    const blueprint = await Blueprint.findOne({ userId: req.user });
    res.status(200).json(blueprint || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
