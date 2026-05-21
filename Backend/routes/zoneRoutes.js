const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");
const { protect } = require("../middleware/authMiddleware");

const {
  createZone,
  getZones,
  updateZone,
  deleteZone
} = require("../controllers/zoneController");

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};

router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  createZone
);

router.get("/", getZones);

router.put("/:id", protect, adminOnly, updateZone);
router.delete("/:id", protect, adminOnly, deleteZone);

module.exports = router;
