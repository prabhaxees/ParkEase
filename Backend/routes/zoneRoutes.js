const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
  createZone,
  getZones
} = require("../controllers/zoneController");

router.post(
  "/",
  upload.single("image"),
  createZone
);

router.get("/", getZones);

module.exports = router;