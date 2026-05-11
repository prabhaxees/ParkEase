const mongoose = require("mongoose");

const zoneSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  imageUrl: {
    type: String,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Zone", zoneSchema);