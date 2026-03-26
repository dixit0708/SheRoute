const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema({
  userId: { type: String }, // kis user ne SOS trigger kiya
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number], // [longitude, latitude]
  },
  timestamp: { type: Date, default: Date.now }, // kab trigger hua
  status: { type: String, default: "sent" }, // sent, resolved
  notifiedContacts: [String], // phone numbers / emails
});

module.exports = mongoose.model("SOSLog", sosSchema);
