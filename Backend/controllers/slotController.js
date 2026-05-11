const Slot = require("../models/Slot");

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

module.exports = {
  createSlot,
  getSlotsByZone
};