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

    res.json(slots);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

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

    await Booking.create({

      slotId: slot._id,

      zoneId: slot.zoneId

    });

    await slot.save();

    res.json(slot);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  createSlot,
  getSlotsByZone,
  bookSlot
};