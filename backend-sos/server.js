const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const sosRoutes = require('./routes/sosRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

dotenv.config();
const app = express();

// Security & Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/ratings', ratingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SheRoute Backend running on http://localhost:${PORT}`);
  console.log('📍 SOS Endpoint: POST /api/sos/sendSOS');
  console.log('⭐ Community Endpoint: POST /api/ratings/rateArea');
});