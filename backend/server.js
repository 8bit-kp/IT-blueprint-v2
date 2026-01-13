import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Ensure this is installed: npm install cors
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import blueprintRoutes from "./routes/blueprintRoutes.js";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import path from "path";
import fs from "fs";

dotenv.config();
const app = express();

// Basic required env checks
const requiredEnvs = ["MONGO_URI", "JWT_SECRET"];
requiredEnvs.forEach((name) => {
  if (!process.env[name]) {
    console.warn(`⚠️  Warning: ${name} is not set. Set it in your environment for production.`);
  }
});

// Trust proxy when behind a load balancer (Heroku, Vercel, etc.)
if (process.env.TRUST_PROXY === "1") app.set("trust proxy", 1);

// CORS - must be set BEFORE other middlewares
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
console.log("🌐 CORS enabled for origin:", CLIENT_ORIGIN);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      CLIENT_ORIGIN,
      'https://blueprintform.onrender.com',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn("⚠️  CORS blocked origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Length", "X-Request-Id"],
  preflightContinue: false,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// Parse JSON with a size limit to mitigate large payload attacks
app.use(express.json({ limit: "10mb" }));

// Security middlewares - helmet configured to not block CORS
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(compression());

// Rate limiter (basic) - but skip for OPTIONS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
});
app.use(limiter);

// Data sanitization against NoSQL injection and XSS
app.use(mongoSanitize());
app.use(xss());

connectDB();

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/blueprint", blueprintRoutes);

// Health
app.get("/", (req, res) => res.send("API running..."));

// Serve frontend in production if build exists
try {
  const frontDist = path.resolve(process.cwd(), "Frontend", "dist");
  if (process.env.NODE_ENV === "production" && fs.existsSync(frontDist)) {
    app.use(express.static(frontDist));
    app.get("/*", (req, res) => res.sendFile(path.join(frontDist, "index.html")));
  }
} catch (err) {
  // ignore if frontend not built
}

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  const message = process.env.NODE_ENV === "production" ? "Server Error" : err.message;
  res.status(statusCode).json({ message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));