const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

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