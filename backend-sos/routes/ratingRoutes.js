const express = require('express');
const { rateArea } = require('../controllers/ratingController');
const protect = require('../middleware/auth');

const router = express.Router();

router.post('/rateArea', protect, rateArea);

module.exports = router;