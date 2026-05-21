const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};

const {
  createSlot,
  getSlotsByZone,
  updateSlot,
  deleteSlot,
  bookSlot
} = require("../controllers/slotController");

router.post("/", protect, adminOnly, createSlot);

router.get("/:zoneId", getSlotsByZone);

router.put("/:id", protect, adminOnly, updateSlot);

router.delete("/:id", protect, adminOnly, deleteSlot);

router.put(
  "/book/:id",
  protect,
  bookSlot
);

module.exports = router;
