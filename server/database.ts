import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/financial-dashboard";

export const connectDatabase = async (): Promise<boolean> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully");

    // Seed demo data when MongoDB is available
    const { seedDemoData } = await import("./seed");
    await seedDemoData();

    return true;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.warn(
      "⚠️ Server will start without MongoDB - some features may not work",
    );
    return false;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
  }
};
