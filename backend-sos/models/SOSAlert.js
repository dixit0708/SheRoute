const mongoose = require('mongoose');

const sosAlertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  message: { type: String, default: 'SOS! I feel unsafe.' },
  status: { type: String, default: 'sent' },
  notifiedContacts: [{
    name: String,
    phone: String,
    email: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('SOSAlert', sosAlertSchema);