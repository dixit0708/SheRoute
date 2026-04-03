const express = require('express');
const { register, login, addEmergencyContact } = require('../controllers/authController');
const protect = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/add-contact', protect, addEmergencyContact);

module.exports = router;