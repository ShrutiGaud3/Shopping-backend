const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fashion_ecommerce', {
      serverSelectionTimeoutMS: 5000
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[MongoDB Warning] Could not connect to local MongoDB (${error.message}).`);
    console.warn(`[MongoDB Notice] Server is running with Mock Data Fallback Mode enabled.`);
  }
};

const getIsConnected = () => isMongoConnected;

module.exports = { connectDB, getIsConnected };
