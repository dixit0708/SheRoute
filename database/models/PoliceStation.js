const mongoose = require("mongoose");

const policeStationSchema = new mongoose.Schema({
  name: String,
  address: String,
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number], // [longitude, latitude]
  },
  contactNumber: String,
});

// GeoSpatial index for proximity queries
policeStationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("PoliceStation", policeStationSchema);
