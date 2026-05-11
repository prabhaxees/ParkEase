const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
  createZone,
  getZones,
  updateZone,
  deleteZone
} = require("../controllers/zoneController");

router.post(
  "/",
  upload.single("image"),
  createZone
);

router.get("/", getZones);

router.put("/:id", updateZone);
router.delete("/:id", deleteZone);

module.exports = router;