const express = require("express");
const router = express.Router();

const {
  addSlot,
  getSlots,
  bookSlot,
  cancelBooking
} = require("../controllers/slotController");

router.post("/add", addSlot);
router.get("/", getSlots);
router.post("/book/:id", bookSlot);
router.post("/cancel/:id", cancelBooking);

module.exports = router;