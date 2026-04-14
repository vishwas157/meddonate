const Medicine = require("../models/Medicine");

// 🔹 Create Medicine
exports.createMedicine = async (req, res) => {
  try {
    const { name, quantity, expiryDate, description, location } = req.body;

    const expiry = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (expiry <= today) {
      return res
        .status(400)
        .json({ message: "Cannot donate expired medicine" });
    }

    // 🔥 Save location also
    const medicine = await Medicine.create({
      name,
      quantity,
      expiryDate,
      description,
      location, // ✅ important
      donor: req.user._id,
    });

    res.status(201).json(medicine);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Get Available Medicines (Search + Pagination)
exports.getMedicines = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let query = {
      status: "available",
      expiryDate: { $gt: today },
    };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const total = await Medicine.countDocuments(query);

    const medicines = await Medicine.find(query)
      .populate("donor", "name email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      count: medicines.length,
      medicines,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Claim Medicine
exports.claimMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    if (medicine.status === "claimed") {
      return res.status(400).json({ message: "Medicine already claimed" });
    }

    if (medicine.donor.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot claim your own medicine" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(medicine.expiryDate) <= today) {
      return res
        .status(400)
        .json({ message: "Cannot claim expired medicine" });
    }

    medicine.status = "claimed";
    medicine.claimedBy = req.user._id;
    medicine.claimedAt = new Date();

    await medicine.save();

    res.json({
      message: "Medicine claimed successfully",
      medicine,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Get My Donations
exports.getMyDonations = async (req, res) => {
  try {
    const medicines = await Medicine.find({ donor: req.user._id })
      .populate("claimedBy", "name email");

    res.json(medicines);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Get My Claims
exports.getMyClaims = async (req, res) => {
  try {
    const medicines = await Medicine.find({ claimedBy: req.user._id })
      .populate("donor", "name email");

    res.json(medicines);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Delete Medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    if (medicine.donor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can delete only your own medicines" });
    }

    if (medicine.status === "claimed") {
      return res
        .status(400)
        .json({ message: "Cannot delete claimed medicine" });
    }

    await medicine.deleteOne();

    res.json({ message: "Medicine deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Get Medicines Expiring Soon (Next 7 Days)
exports.getExpiringSoon = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    nextWeek.setHours(23, 59, 59, 999);

    const medicines = await Medicine.find({
      status: "available",
      expiryDate: { $gt: today, $lte: nextWeek }
    }).populate("donor", "name email");

    res.json(medicines);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};