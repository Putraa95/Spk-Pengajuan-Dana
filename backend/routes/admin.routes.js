// backend/routes/admin.routes.js
const express = require("express");
const router = express.Router();
const Pengajuan = require("../models/Pengajuan");
const authMiddleware = require("../middleware/auth.middleware");

// ✅ GET semua pengajuan (safe version)
router.get("/pengajuan", authMiddleware, async (req, res) => {
  try {
    // Cari semua pengajuan, populate user jika ada
    const pengajuan = await Pengajuan.find()
      .populate({
        path: "user",
        select: "name email",
        options: { strictPopulate: false },
      })
      .sort({ wpScore: -1 });

    // fallback: jika user tidak ada, assign dummy
    const safePengajuan = pengajuan.map((p) => ({
      _id: p._id,
      user: p.user || { name: "Unknown", email: "-" },
      jumlah: p.jumlah,
      status: p.status || "Diproses",
      wpScore: p.wpScore || 0,
    }));

    res.json(safePengajuan);
  } catch (err) {
    console.error("ERROR FETCH PENGAJUAN:", err.message);
    res.status(500).json({ message: "Gagal mengambil data pengajuan" });
  }
});

// ✅ PATCH: Approve / Reject pengajuan
router.patch("/pengajuan/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validasi status
    if (!["Disetujui", "Ditolak", "Diproses"].includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const updated = await Pengajuan.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate({
      path: "user",
      select: "name email",
      options: { strictPopulate: false },
    });

    if (!updated)
      return res.status(404).json({ message: "Pengajuan tidak ditemukan" });

    res.json(updated);
  } catch (err) {
    console.error("ERROR UPDATE PENGAJUAN:", err.message);
    res.status(500).json({ message: "Gagal update pengajuan" });
  }
});

module.exports = router;
