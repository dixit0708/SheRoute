const SOSAlert = require('../models/SOSAlert');
const User = require('../models/User');

const sendSOS = async (req, res) => {
  try {
    const { latitude, longitude, message = 'SOS! I feel unsafe.' } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const sos = new SOSAlert({
      user: req.user.id,
      location: { latitude, longitude },
      message
    });
    await sos.save();

    // Mock SMS / Email
    const notifications = [];
    user.emergencyContacts.forEach(contact => {
      const alertMsg = `🚨 SOS from ${user.name} at https://maps.google.com/?q=${latitude},${longitude}\nMessage: ${message}`;
      console.log(`📨 MOCK NOTIFICATION → ${contact.name} (${contact.email || contact.phone}): ${alertMsg}`);
      notifications.push({ name: contact.name, status: 'sent' });
    });

    // Save notified contacts
    sos.notifiedContacts = user.emergencyContacts;
    await sos.save();

    res.status(200).json({
      success: true,
      message: 'SOS sent successfully!',
      sosId: sos._id,
      notifications,
      location: { latitude, longitude }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { sendSOS };