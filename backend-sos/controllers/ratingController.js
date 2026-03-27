const SafetyRating = require('../models/SafetyRating');

const rateArea = async (req, res) => {
  try {
    const { latitude, longitude, rating, comment } = req.body;

    if (!latitude || !longitude || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Latitude, longitude and rating (1-5) are required' });
    }

    const newRating = new SafetyRating({
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]   // MongoDB GeoJSON format
      },
      rating,
      comment: comment || '',
      user: req.user.id
    });

    await newRating.save();

    res.status(201).json({
      success: true,
      message: 'Safety rating submitted! Thank you for helping the community.',
      ratingId: newRating._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { rateArea };