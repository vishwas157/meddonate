const User = require("../models/User");
const Medicine = require("../models/Medicine");

exports.getStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    nextWeek.setHours(23, 59, 59, 999);

    const totalUsers = await User.countDocuments();

    const totalMedicines = await Medicine.countDocuments();

    const available = await Medicine.countDocuments({
      status: "available",
      expiryDate: { $gt: today }
    });

    const claimed = await Medicine.countDocuments({
      status: "claimed"
    });

    const expired = await Medicine.countDocuments({
      expiryDate: { $lte: today }
    });

    const expiringSoon = await Medicine.countDocuments({
      status: "available",
      expiryDate: { $gt: today, $lte: nextWeek }
    });

    res.json({
      totalUsers,
      totalMedicines,
      available,
      claimed,
      expired,
      expiringSoon
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
