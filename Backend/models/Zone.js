const mongoose = require("mongoose");

const zoneSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  imageUrl: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["active", "maintenance"],
    default: "active"
  }

}, { timestamps: true });

module.exports = mongoose.model("Zone", zoneSchema);