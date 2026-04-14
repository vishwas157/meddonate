require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const passport = require("./config/googleAuth");

const authRoutes = require("./routes/authRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const statsRoutes = require("./routes/statsRoutes");
const { protect } = require("./middleware/authMiddleware");

// 🔥 Connect DB
connectDB();

const app = express();

// =============================
// 🔥 FIXED CORS (PRODUCTION READY)
// =============================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://meddonate-two.vercel.app"
    ],
    credentials: true,
  })
);

// 🔥 Middleware
app.use(express.json());
app.use(passport.initialize());

// =============================
// ROUTES
// =============================
app.use("/api/auth", authRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/stats", statsRoutes);

// =============================
// HEALTH CHECK
// =============================
app.get("/", (req, res) => {
  res.send("🚀 MedDonate API Running...");
});

// =============================
// 🔐 PROTECTED ROUTE
// =============================
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

// =============================
// START SERVER
// =============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});