const express = require("express");

const router = express.Router();

const {
  getBookings
} = require("../controllers/bookingController");

router.get("/", getBookings);

module.exports = router;
