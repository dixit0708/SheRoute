const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

// DB connect
require("../database/db");

// Models
const SOSLog = require("../database/models/SOSLog");

app.post("/sendSOS", async (req, res) => {
  try {
    const { userId, location } = req.body;

    // Bas ek simple SOS log insert karte hain
    const sosLog = await SOSLog.create({
      userId,
      location,
      status: "sent",
      notifiedContacts: ["+91-9123456789"], // demo ke liye hardcoded
    });

    res.json({ message: "SOS sent successfully", sosLog });
  } catch (err) {
    console.error("❌ SOS Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log("Backend SOS running on http://localhost:3001");
});
