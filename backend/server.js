const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const passport = require("./config/googleAuth");

const authRoutes = require("./routes/authRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const statsRoutes = require("./routes/statsRoutes");
const { protect } = require("./middleware/authMiddleware");

dotenv.config();
connectDB();

const app = express();

// 🔥 Proper CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// 🔥 Passport Init (No session needed)
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/stats", statsRoutes);

// Health
app.get("/", (req, res) => {
  res.send("MedDonate API Running...");
});

// Protected test
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});