const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getStats } = require("../controllers/statsController");

// Admin-only analytics
router.get("/", protect, adminOnly, getStats);

module.exports = router;
