import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
mongoose.connect(process.env.DB_URI)

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

export default db;