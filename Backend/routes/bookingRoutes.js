const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getBookings,
  getMyBookings,
  cancelBooking
} = require("../controllers/bookingController");

router.get("/", getBookings);

router.get(
  "/my",
  protect,
  getMyBookings
);

router.delete(
  "/:id",
  protect,
  cancelBooking
);

module.exports = router;