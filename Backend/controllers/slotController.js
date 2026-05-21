const Slot = require("../models/Slot");

const Booking = require("../models/Booking");

const PREBOOK_DURATION_MS = 60 * 60 * 1000;

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
    const now = new Date();
    const bookings = await Booking.find({
      slotId: { $in: slotIds },
      $or: [
        { bookingType: "now" },
        { bookingType: { $exists: false } },
        { endTime: { $gt: now } }
      ]
    }).populate("userId", "name email");

    const relevantBookingBySlot = {};

    bookings.forEach((booking) => {
      const key = booking.slotId.toString();
      const currentBooking = relevantBookingBySlot[key];

      if (
        booking.bookingType === "now" ||
        !booking.bookingType ||
        !currentBooking ||
        booking.startTime < currentBooking.startTime
      ) {
        relevantBookingBySlot[key] = booking;
      }
    });

    const slotsWithBookingName = slots.map((slot) => {
      const booking = relevantBookingBySlot[slot._id.toString()];

      return {
        ...slot.toObject(),
        bookedByName: slot.status === "booked" ? booking?.userId?.name || null : null,
        bookedByEmail: slot.status === "booked" ? booking?.userId?.email || null : null,
        nextReservationTime: slot.status === "available" ? booking?.startTime || null : null
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

const updateSlot = async (req, res) => {
  try {
    const { accessType } = req.body;

    if (!["default", "faculty", "parent"].includes(accessType)) {
      return res.status(400).json({ message: "Invalid slot type" });
    }

    const slot = await Slot.findByIdAndUpdate(
      req.params.id,
      { accessType },
      { new: true, runValidators: true }
    );

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bookSlot = async (req, res) => {

  try {

    const requestedStartTime = req.body.startTime
      ? new Date(req.body.startTime)
      : new Date();
    const now = new Date();
    const isPrebook = requestedStartTime.getTime() > now.getTime() + 60 * 1000;
    const requestedEndTime = isPrebook
      ? new Date(requestedStartTime.getTime() + PREBOOK_DURATION_MS)
      : null;

    if (Number.isNaN(requestedStartTime.getTime())) {
      return res.status(400).json({
        message: "Invalid booking time"
      });
    }

    if (requestedStartTime < new Date(now.getTime() - 60 * 1000)) {
      return res.status(400).json({
        message: "Booking time cannot be in the past"
      });
    }

    if (isPrebook && !["faculty", "parent"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only faculty and parent users can prebook slots"
      });
    }

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

    const conflictQuery = {
      slotId: slot._id,
      $or: [
        { bookingType: "now" },
        { bookingType: { $exists: false } }
      ]
    };

    if (isPrebook) {
      conflictQuery.$or.push({
        startTime: { $lt: requestedEndTime },
        endTime: { $gt: requestedStartTime }
      });
    } else {
      conflictQuery.$or.push({
        endTime: { $gt: now }
      });
    }

    const conflictingBooking = await Booking.findOne(conflictQuery);

    if (conflictingBooking) {
      return res.status(400).json({
        message: "Slot is already reserved for this time"
      });
    }

    const slotAccessType = slot.accessType || "default";

    if (slotAccessType !== "default" && slotAccessType !== req.user.role) {

      return res.status(403).json({
        message: `This slot is only for ${slotAccessType} users`
      });

    }

    if (!isPrebook) {
      slot.status = "booked";

      await slot.save();
    }

    const booking = await Booking.create({

      userId: req.user.id,

      slotId: slot._id,

      zoneId: slot.zoneId,

      startTime: requestedStartTime,

      endTime: requestedEndTime,

      bookingType: isPrebook ? "prebook" : "now"

    });

    console.log("BOOKING CREATED:", booking);

    res.json({
      ...slot.toObject(),
      nextReservationTime: isPrebook ? requestedStartTime : null,
      booking
    });

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
  updateSlot,
  deleteSlot,
  bookSlot
};
