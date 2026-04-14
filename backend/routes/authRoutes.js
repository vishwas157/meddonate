const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const { registerUser, loginUser } = require("../controllers/authController");

// =============================
// Auth Routes
// =============================

router.post("/register", registerUser);
router.post("/login", loginUser);

// =============================
// Google Login
// =============================

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { user, token } = req.user;

    res.redirect(
      `http://localhost:5173/google-success?token=${token}&user=${encodeURIComponent(
        JSON.stringify(user)
      )}`
    );
  }
);

// =============================
// Update Profile (Protected)
// =============================

router.put("/update-profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update name
    if (req.body.name) {
      user.name = req.body.name;
    }

    // Update role safely (force lowercase + validate)
    if (req.body.role) {
      const allowedRoles = ["donor", "receiver", "admin"];
      const newRole = req.body.role.toLowerCase();

      if (!allowedRoles.includes(newRole)) {
        return res.status(400).json({ message: "Invalid role value" });
      }

      user.role = newRole;
    }

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;