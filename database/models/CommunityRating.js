const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // kis user ne diya
  areaId: String, // kis area/route ke liye rating hai
  rating: Number, // 1–5 stars
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CommunityRating", ratingSchema);
