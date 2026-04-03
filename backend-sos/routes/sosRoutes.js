const express = require('express');
const { sendSOS } = require('../controllers/sosController');
const protect = require('../middleware/auth');

const router = express.Router();

router.post('/sendSOS', sendSOS);
module.exports = router;