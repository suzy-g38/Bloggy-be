import mongoose from 'mongoose';

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MONGO_URI is not defined in .env");
}

export const connectToDatabase = async () => {
    try {
      await mongoose.connect(uri);
      console.log("Connected to MongoDB using Mongoose");
    } catch (error) {
      console.error("MongoDB connection failed:", error);
      throw error;
    }
  };