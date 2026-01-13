import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Blueprint from "../models/Blueprint.js";
import cache from "../utils/cache.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, companyName, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

  // Use a stronger salt rounds value
  const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12;
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      username,
      email,
      companyName,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Server misconfigured: JWT secret missing" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Attempt to fetch the user's blueprint and include it in the login response
    let blueprintData = {};
    try {
      const cacheKey = `blueprint:${user._id}`;
      const cached = await cache.get(cacheKey);
      if (cached) {
        blueprintData = cached;
      } else {
        const bp = await Blueprint.findOne({ userId: user._id }).lean().select("-__v");
        blueprintData = bp || {};
        // cache for subsequent requests
        cache.set(cacheKey, blueprintData, parseInt(process.env.BLUEPRINT_CACHE_TTL || "60", 10)).catch(() => {});
      }
    } catch (e) {
      console.warn("Failed to include blueprint in login response:", e.message || e);
    }

    res.status(200).json({
      message: "Login successful",
      token,
      username: user.username,
      blueprint: blueprintData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
