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
  },

  startTime: {
    type: Date,
    default: Date.now
  },

  endTime: {
    type: Date,
    default: null
  },

  bookingType: {
    type: String,
    enum: ["now", "prebook"],
    default: "now"
  }

});

module.exports = mongoose.model(
  "Booking",
  bookingSchema
);
