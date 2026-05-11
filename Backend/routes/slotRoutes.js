const express = require("express");

const router = express.Router();

const {
  createSlot,
  getSlotsByZone
} = require("../controllers/slotController");

router.post("/", createSlot);

router.get("/:zoneId", getSlotsByZone);

module.exports = router;