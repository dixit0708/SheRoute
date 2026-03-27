const mongoose = require("./db");
const User = require("./models/user");
const PoliceStation = require("./models/PoliceStation");
const LightingData = require("./models/LightingData");
const CrowdDensity = require("./models/CrowdDensity");
const CommunityRating = require("./models/CommunityRating");
const SOSLog = require("./models/SOSLog");

async function seedData() {
  // Police Station
  await PoliceStation.create({
    name: "Civil Lines Police Station",
    address: "Civil Lines, Moradabad",
    location: { type: "Point", coordinates: [78.7733, 28.8389] },
    contactNumber: "0591-123456",
  });

  // Lighting Data
  await LightingData.create({
    streetId: "NH24_Segment_12",
    location: { type: "Point", coordinates: [78.774, 28.8395] },
    lightingScore: 8,
  });

  // Crowd Density
  await CrowdDensity.create({
    areaId: "Market_Area_01",
    location: { type: "Point", coordinates: [78.775, 28.84] },
    crowdScore: 7,
  });

  // User
  const user = await User.create({
    name: "Test User",
    email: "test@example.com",
    phone: "+91-9876543210",
    emergencyContacts: [
      { name: "Friend", phone: "+91-9123456789", relation: "Friend" },
    ],
  });

  // Community Rating
  await CommunityRating.create({
    userId: user._id,
    areaId: "NH24_Segment_12",
    rating: 4,
    comment: "Well lit and safe",
  });

  // SOS Log
  await SOSLog.create({
    userId: user._id,
    location: { type: "Point", coordinates: [78.776, 28.841] },
    status: "sent",
    notifiedContacts: ["+91-9123456789"],
  });

  console.log("✅ Mock data inserted successfully");
  mongoose.disconnect();
}

seedData();
