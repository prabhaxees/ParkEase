const express = require("express");

const router = express.Router();

const {
  createSlot,
  getSlotsByZone,
  bookSlot
} = require("../controllers/slotController");

router.post("/", createSlot);

router.get("/:zoneId", getSlotsByZone);

router.put("/book/:id", bookSlot);

module.exports = router;