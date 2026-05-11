const Booking = require("../models/Booking");

const getBookings = async (req, res) => {

  try {

    const bookings = await Booking.find()
      .populate("slotId")
      .populate("zoneId");

    res.json(bookings);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  getBookings
};