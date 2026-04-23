const Slot = require("../models/Slot");

const addSlot = async (req, res) => {
  try {
    const { slotNumber, zone } = req.body;

    const slot = await Slot.create({
      slotNumber,
      zone
    });

    res.status(201).json(slot);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSlots = async (req, res) => {
  try {
    const slots = await Slot.find();
    res.json(slots);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bookSlot = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot.status === "booked") {
      return res.status(400).json({ message: "Already booked" });
    }

    slot.status = "booked";
    await slot.save();

    res.json({ message: "Slot booked successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    slot.status = "available";
    await slot.save();

    res.json({ message: "Booking cancelled" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addSlot,
  getSlots,
  bookSlot,
  cancelBooking
};