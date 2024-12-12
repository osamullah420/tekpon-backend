import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose
      .connect(mongoURI)
      .then(() => console.log("Connected to MongoDB!"))
      .catch((err) => console.error("MongoDB connection error:", err));
  } catch (error) {
    console.log(`Error while connecting to db : ${error}`);
  }
};

export default connectDB;
