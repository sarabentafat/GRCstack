const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CLOUD_URL);
    console.log("Connected to MongoDB ^-^");
  } catch (error) {
    // Use 'error' here to handle the error properly
    console.error("MongoDB connection failed", error); // Log the actual error
  }
};
