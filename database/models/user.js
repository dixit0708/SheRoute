const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  phone: String,
  passwordHash: String, // agar login system add karna ho
  emergencyContacts: [
    {
      name: String,
      phone: String,
      relation: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
