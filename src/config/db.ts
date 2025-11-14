import mongoose from "mongoose";

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error("❌ MONGODB_URI environment variable is missing");
    process.exit(1);
  }

  let retries = 5;
  while (retries) {
    try {
      await mongoose.connect(mongoURI);
      console.log("✅ MongoDB connected successfully!");
      break;
    } catch (err) {
      console.error("MongoDB connection error:", err);
      retries -= 1;
      console.log(`🔁 Retrying connection... attempts left: ${retries}`);
      await new Promise(res => setTimeout(res, 5000));
    }
  }

  if (!retries) {
    console.error("❌ Could not connect to MongoDB after multiple retries. Exiting...");
    process.exit(1);
  }
};

export default connectDB;
