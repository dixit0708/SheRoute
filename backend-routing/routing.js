const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

// Load mock data safely
let dbData = {};
try {
  dbData = JSON.parse(fs.readFileSync('../database/mock_data.json'));
} catch (err) {
  console.error("Error loading mock_data.json:", err.message);
}

// Safety scoring function
function calculateSafetyScore(lighting, crowd, police, rating) {
  return (0.3*lighting + 0.25*crowd + 0.25*police + 0.2*rating);
}

// API endpoint
app.post('/getSafeRoute', (req, res) => {
  const { source, destination } = req.body;

  // ✅ Error handling
  if (!source || !destination) {
    return res.status(400).json({ error: "Source and destination required" });
  }

  console.log(`Request received: Source=${source}, Destination=${destination}`);

  // ✅ Use database values (fallback to dummy if missing)
  const routes = [
    {
      route: "Route A",
      lighting: dbData.lighting?.street1 || 0.8,
      crowd: dbData.crowdDensity?.area1 || 0.7,
      police: 0.9,
      rating: dbData.ratings?.routeA || 0.6
    },
    {
      route: "Route B",
      lighting: dbData.lighting?.street2 || 0.5,
      crowd: dbData.crowdDensity?.area2 || 0.4,
      police: 0.6,
      rating: dbData.ratings?.routeB || 0.7
    }
  ];

  // ✅ Apply scoring
  routes.forEach(r => {
    r.score = calculateSafetyScore(r.lighting, r.crowd, r.police, r.rating);
  });

  // ✅ Pick safest route
  const safest = routes.reduce((a, b) => a.score > b.score ? a : b);

  res.json({ safest_route: safest, all_routes: routes });
});

// Future: Maps API integration placeholder
// TODO: Replace dummy routes with Google Maps / OpenStreetMap API results

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});
