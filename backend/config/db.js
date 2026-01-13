import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI missing in environment");
    process.exit(1);
  }

  // Recommended connection options for resilience
  const options = {
    // useNewUrlParser, useUnifiedTopology are defaults in modern mongoose
    maxPoolSize: parseInt(process.env.MONGO_MAX_POOL_SIZE || "10", 10),
    serverSelectionTimeoutMS: 5000,
  };

  // Retry logic with backoff
  const maxRetries = parseInt(process.env.MONGO_CONNECT_RETRIES || "5", 10);
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      await mongoose.connect(uri, options);
      console.log("✅ MongoDB connected successfully");
      return;
    } catch (error) {
      attempt += 1;
      console.error(`MongoDB connection attempt ${attempt} failed:`, error.message);
      if (attempt > maxRetries) {
        console.error("❌ All MongoDB connection attempts failed. Exiting.");
        process.exit(1);
      }
      // exponential backoff
      const backoff = Math.min(1000 * 2 ** attempt, 30000);
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
};

export default connectDB;
