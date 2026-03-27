const mongoose = require("mongoose");

const crowdSchema = new mongoose.Schema({
  areaId: String, // unique area identifier
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number], // [lng, lat]
  },
  crowdScore: Number, // 0–10 scale
  timestamp: { type: Date, default: Date.now }, // when data was last updated
});

module.exports = mongoose.model("CrowdDensity", crowdSchema);
