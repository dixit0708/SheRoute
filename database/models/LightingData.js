const mongoose = require("mongoose");

const lightingSchema = new mongoose.Schema({
  streetId: String, // Map segment ID
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number], // [lng, lat]
  },
  lightingScore: Number, // 0–10 scale
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LightingData", lightingSchema);
