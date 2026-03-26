const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://dhruv:dhruv09@cluster0.tjzclqf.mongodb.net/sheroute")
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));
