const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const {
  createSlot,
  getSlotsByZone,
  deleteSlot,
  bookSlot
} = require("../controllers/slotController");

router.post("/", createSlot);

router.get("/:zoneId", getSlotsByZone);

router.delete("/:id", deleteSlot);

router.put(
  "/book/:id",
  protect,
  bookSlot
);

module.exports = router;