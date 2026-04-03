const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Using your MongoDB Atlas Cloud database
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not set");
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database Connected successfully! Host: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Database connection failed: ${err.message}`);
    throw err;
  }
};

module.exports = connectDB;
