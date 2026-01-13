import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import blueprintRoutes from "./routes/blueprintRoutes.js";

dotenv.config();
const app = express();

// Apply compression middleware for better performance
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for large form data
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/blueprint", blueprintRoutes);

app.get("/", (req, res) => res.send("API running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
