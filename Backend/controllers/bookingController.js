const Booking = require("../models/Booking");
const Slot = require("../models/Slot");

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

const getMyBookings = async (req, res) => {

  try {

    const bookings = await Booking.find({

      userId: req.user.id

    })

    .populate("slotId")
    .populate("zoneId");

    res.json(bookings);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const slot = await Slot.findById(booking.slotId);

    if (slot && slot.status === "booked") {
      slot.status = "available";
      await slot.save();
    }

    await booking.deleteOne();

    res.json({ message: "Booking canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBookings,
  getMyBookings,
  cancelBooking
};