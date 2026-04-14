const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createMedicine,
  getMedicines,
  claimMedicine,
  getMyDonations,
  getMyClaims,
  deleteMedicine,
  getExpiringSoon,
} = require("../controllers/medicineController");

// Donate medicine
router.post("/", protect, createMedicine);

// View available medicines
router.get("/", getMedicines);

// Expiring soon
router.get("/expiring-soon", getExpiringSoon);

// Claim medicine
router.put("/:id/claim", protect, claimMedicine);

// Dashboard routes
router.get("/my-donations", protect, getMyDonations);
router.get("/my-claims", protect, getMyClaims);

// Delete medicine
router.delete("/:id", protect, deleteMedicine);

module.exports = router;
