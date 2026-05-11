const Slot = require("../models/Slot");

const Booking = require("../models/Booking");

const createSlot = async (req, res) => {

  try {

    const slot = await Slot.create(req.body);

    res.status(201).json(slot);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

const getSlotsByZone = async (req, res) => {

  try {

    const slots = await Slot.find({
      zoneId: req.params.zoneId
    });

    const slotIds = slots.map((slot) => slot._id);
    const bookings = await Booking.find({
      slotId: { $in: slotIds }
    }).populate("userId", "name email");

    const latestBookingBySlot = {};

    bookings.forEach((booking) => {
      const key = booking.slotId.toString();
      if (!latestBookingBySlot[key] || booking.bookedAt > latestBookingBySlot[key].bookedAt) {
        latestBookingBySlot[key] = booking;
      }
    });

    const slotsWithBookingName = slots.map((slot) => {
      const booking = latestBookingBySlot[slot._id.toString()];

      return {
        ...slot.toObject(),
        bookedByName: booking?.userId?.name || null,
        bookedByEmail: booking?.userId?.email || null
      };
    });

    res.json(slotsWithBookingName);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

const deleteSlot = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    await Booking.deleteMany({ slotId: slot._id });
    await slot.deleteOne();

    res.json({ message: "Slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bookSlot = async (req, res) => {

  try {

    const slot = await Slot.findById(req.params.id);

    if (!slot) {

      return res.status(404).json({
        message: "Slot not found"
      });

    }

    if (slot.status === "booked") {

      return res.status(400).json({
        message: "Slot already booked"
      });

    }

    slot.status = "booked";

    await slot.save();

    const booking = await Booking.create({

      userId: req.user.id,

      slotId: slot._id,

      zoneId: slot.zoneId

    });

    console.log("BOOKING CREATED:", booking);

    res.json(slot);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  createSlot,
  getSlotsByZone,
  deleteSlot,
  bookSlot
};