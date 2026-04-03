const nodemailer = require('nodemailer');
const SOSAlert = require('../models/SOSAlert');
const User = require('../models/User');

const sendSOS = async (req, res) => {
  try {
    // 1. Accept either naming convention from the frontend
    const latitude = req.body.lat || req.body.latitude;
    const longitude = req.body.lng || req.body.longitude;
    const message = req.body.message || 'SOS! I feel unsafe.';

    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }

    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

    // 2. Setup REAL Email Sending using your .env variables
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMERGENCY_CONTACT,
      subject: '🚨 EMERGENCY SOS ALERT: SheRoute 🚨',
      text: `URGENT! An SOS alert was triggered.\n\nMessage: ${message}\n\nLive Location: ${mapsLink}`
    };

    // 3. Send the actual email
    await transporter.sendMail(mailOptions);
    console.log("🚨 REAL SOS Email Sent Successfully!");

    // 4. Respond to the frontend so the popup works
    res.status(200).json({
      success: true,
      message: 'SOS sent successfully to your emergency contact!',
      location: { latitude, longitude }
    });

  } catch (err) {
    console.error("SOS Controller Error:", err);
    res.status(500).json({ success: false, message: 'Server error while sending SOS' });
  }
};

module.exports = { sendSOS };