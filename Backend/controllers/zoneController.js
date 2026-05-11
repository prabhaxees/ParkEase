const Zone = require("../models/Zone");

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

module.exports = {
  createZone,
  getZones
};