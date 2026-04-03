const mongoose = require('mongoose');

const safetyRatingSchema = new mongoose.Schema({
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// 2dsphere index for geo-queries (future map features)
safetyRatingSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('SafetyRating', safetyRatingSchema);