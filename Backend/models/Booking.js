const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Slot"
  },

  zoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Zone"
  },

  bookedAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model(
  "Booking",
  bookingSchema
);