import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { saveBlueprint, getBlueprint } from "../controllers/blueprintController.js";

const router = express.Router();

router.post("/save", protect, saveBlueprint);
router.get("/get", protect, getBlueprint);

export default router;
