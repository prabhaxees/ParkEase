const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getBookings,
  getMyBookings
} = require("../controllers/bookingController");

router.get("/", getBookings);

router.get(
  "/my",
  protect,
  getMyBookings
);

module.exports = router;