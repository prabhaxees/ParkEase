const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  slotNumber: String,
  zone: String,
  status: {
    type: String,
    enum: ["available", "booked"],
    default: "available"
  }
});

module.exports = mongoose.model("Slot", slotSchema);