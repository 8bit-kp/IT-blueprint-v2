import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Get current user
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
