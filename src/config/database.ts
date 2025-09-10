import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    // Only connect if not already connected
    if (mongoose.connection.readyState === 0) { // 0 = disconnected
      const mongoURI =
        process.env.MONGODB_URI || "mongodb://localhost:27017/tasks-crud";
      await mongoose.connect(mongoURI);
      console.log("MongoDB connected successfully");
    } else {
      console.log("MongoDB already connected");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 0) { // Only disconnect if connected
      await mongoose.disconnect();
      console.log("MongoDB disconnected successfully");
    }
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
  }
};
