const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({

  slotNumber: String,

  zoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Zone"
  },

  x: Number,

  y: Number,

  status: {
    type: String,
    enum: ["available", "booked"],
    default: "available"
  }

});

module.exports = mongoose.model("Slot", slotSchema);