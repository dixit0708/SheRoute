require("dotenv").config({ path: "../.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); 
const app = express();

app.use(cors({ origin: ["http://localhost:3000", "http://127.0.0.1:3000"] })); 
app.use(express.json());

// 👇 TWEAK 1: Use the connectDB function we created in db.js
const connectDB = require("../database/db");

// Import Models
const LightingData = require("../database/models/LightingData");
const CrowdDensity = require("../database/models/CrowdDensity");
const CommunityRating = require("../database/models/CommunityRating");
const PoliceStation = require("../database/models/PoliceStation");

// Safety scoring function
function calculateSafetyScore(lighting, crowd, police, rating) {
  return 0.3 * lighting + 0.25 * crowd + 0.25 * police + 0.2 * rating;
}

// 👇 TWEAK 2: A simple GET route so you can test the server in your browser
app.get('/', (req, res) => {
  res.send('SheRoute Backend is up and running! 🚀');
});

// API endpoint (Keeping your logic exactly the same!)
app.post("/getSafeRoute", async (req, res) => {
  const { source, destination } = req.body;

  if (!source || !destination || !source.lat || !destination.lat) {
    return res.status(400).json({ error: "Valid source and destination coordinates required" });
  }

  console.log(`Request received: Source=(${source.lat}, ${source.lng}), Dest=(${destination.lat}, ${destination.lng})`);

  try {
    // Fetch values from DB (using schema field names)
    const lighting1 = await LightingData.findOne({ streetId: "street1" });
    const lighting2 = await LightingData.findOne({ streetId: "street2" });

    const crowd1 = await CrowdDensity.findOne({ areaId: "area1" });
    const crowd2 = await CrowdDensity.findOne({ areaId: "area2" });

    const ratingA = await CommunityRating.findOne({ areaId: "routeA" });
    const ratingB = await CommunityRating.findOne({ areaId: "routeB" });

    // Police presence (dummy for now, can fetch nearest station later)
    const policeA = 0.9;
    const policeB = 0.6;

    // Build routes
    const routes = [
      {
        route: "Route A",
        lighting: lighting1?.lightingScore ?? 0.8,
        crowd: crowd1?.crowdScore ?? 0.7,
        police: policeA,
        rating: ratingA?.rating || 0.6,
      },
      {
        route: "Route B",
        lighting: lighting2?.lightingScore ?? 0.5,
        crowd: crowd2?.crowdScore ?? 0.4,
        police: policeB,
        rating: ratingB?.rating || 0.7,
      },
    ];

    // Apply scoring
    routes.forEach((r) => {
      r.score = calculateSafetyScore(r.lighting, r.crowd, r.police, r.rating);
    });

    // Pick safest route
    const safest = routes.reduce((a, b) => (a.score > b.score ? a : b));

    // CREATE A MOCK SAFE DETOUR WAYPOINT
    const safeDetourWaypoint = {
      lat: (source.lat + destination.lat) / 2 + 0.005, 
      lng: (source.lng + destination.lng) / 2 + 0.005  
    };

    // Return both your original JSON data AND the new waypoints array
    res.json({ 
      safest_route: safest, 
      all_routes: routes,
      waypoints: [source, safeDetourWaypoint, destination] 
    });

  } catch (err) {
    console.error("Error in /getSafeRoute:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const start = async () => {
  try {
    await connectDB();
    app.listen(3002, () => {
      console.log("Backend routing running on http://localhost:3002");
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
  }
};

start();
