const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
    },

    // 🔥 ADD THIS LOCATION OBJECT
    location: {
      city: {
        type: String,
      },
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },

    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    claimedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["available", "claimed"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medicine", medicineSchema);