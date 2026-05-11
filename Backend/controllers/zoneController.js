const Zone = require("../models/Zone");
const Slot = require("../models/Slot");
const Booking = require("../models/Booking");

const cloudinary = require("../config/cloudinary");

const fs = require("fs-extra");

const createZone = async (req, res) => {

  try {

    const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "ParkEaseZones"
      }
    );

    await fs.remove(req.file.path);

    const zone = await Zone.create({

      name: req.body.name,

      imageUrl: result.secure_url

    });

    res.status(201).json(zone);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

const getZones = async (req, res) => {

  try {

    const zones = await Zone.find();

    res.json(zones);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

const updateZone = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);

    if (!zone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    if (req.body.status) {
      zone.status = req.body.status;
    }

    const updatedZone = await zone.save();

    res.json(updatedZone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteZone = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);

    if (!zone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    await Slot.deleteMany({ zoneId: zone._id });
    await Booking.deleteMany({ zoneId: zone._id });
    await zone.deleteOne();

    res.json({ message: "Zone deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createZone,
  getZones,
  updateZone,
  deleteZone
};