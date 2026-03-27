const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

// DB connect
require("../database/db");

// Import Models
const LightingData = require("../database/models/LightingData");
const CrowdDensity = require("../database/models/CrowdDensity");
const CommunityRating = require("../database/models/CommunityRating");
const PoliceStation = require("../database/models/PoliceStation");

// Safety scoring function
function calculateSafetyScore(lighting, crowd, police, rating) {
  return 0.3 * lighting + 0.25 * crowd + 0.25 * police + 0.2 * rating;
}

// API endpoint
app.post("/getSafeRoute", async (req, res) => {
  const { source, destination } = req.body;

  if (!source || !destination) {
    return res.status(400).json({ error: "Source and destination required" });
  }

  console.log(`Request received: Source=${source}, Destination=${destination}`);

  try {
    // Fetch values from DB
    const lighting1 = await LightingData.findOne({ street: "street1" });
    const lighting2 = await LightingData.findOne({ street: "street2" });

    const crowd1 = await CrowdDensity.findOne({ area: "area1" });
    const crowd2 = await CrowdDensity.findOne({ area: "area2" });

    const ratingA = await CommunityRating.findOne({ routeName: "Route A" });
    const ratingB = await CommunityRating.findOne({ routeName: "Route B" });

    // Police presence (dummy for now, can fetch nearest station later)
    const policeA = 0.9;
    const policeB = 0.6;

    // Build routes
    const routes = [
      {
        route: "Route A",
        lighting: lighting1?.score || 0.8,
        crowd: crowd1?.score || 0.7,
        police: policeA,
        rating: ratingA?.rating || 0.6,
      },
      {
        route: "Route B",
        lighting: lighting2?.score || 0.5,
        crowd: crowd2?.score || 0.4,
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

    res.json({ safest_route: safest, all_routes: routes });
  } catch (err) {
    console.error("Error in /getSafeRoute:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
