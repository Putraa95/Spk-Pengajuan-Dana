const express = require("express");
const ValidId = require("../models/ValidId");
const User = require("../models/User");

const router = express.Router();

/**
 * ✅ GET semua Valid ID
 * GET /api/admin/valid-ids
 */
router.get("/valid-ids", async (req, res) => {
  try {
    const ids = await ValidId.find().populate("assignedTo", "nama idKaryawan");
    res.json({ success: true, data: ids });
  } catch (err) {
    console.error("❌ [GET] Error mengambil Valid IDs:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * ✅ CREATE Valid ID baru
 * POST /api/admin/valid-ids
 * body: { idKaryawan: "LS12345" }
 */
router.post("/valid-ids", async (req, res) => {
  try {
    const { idKaryawan } = req.body;
    console.log("📥 [POST] Request diterima untuk tambah ID:", idKaryawan);

    // Validasi input kosong
    if (!idKaryawan || idKaryawan.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "❌ Field idKaryawan wajib diisi",
      });
    }

    // Validasi pola ID (boleh LS + 3-10 angka atau huruf kapital tanpa spasi)
    if (!/^LS[0-9A-Z]{3,10}$/.test(idKaryawan)) {
      return res.status(400).json({
        success: false,
        message:
          "❌ Format ID tidak valid (harus diawali LS dan 3–10 karakter berikutnya berupa huruf/angka, contoh: LS00123)",
      });
    }

    // Cek duplikasi
    const existing = await ValidId.findOne({ idKaryawan });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "❌ ID sudah terdaftar di database",
      });
    }

    // Simpan ID baru
    const newId = await ValidId.create({
      idKaryawan,
      assigned: false,
      assignedTo: null,
    });

    console.log("✅ [POST] ID berhasil ditambahkan:", newId.idKaryawan);

    res.status(201).json({
      success: true,
      message: "✅ Valid ID berhasil ditambahkan",
      data: newId,
    });
  } catch (err) {
    console.error("❌ [POST] Error membuat Valid ID:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * ✅ UPDATE status assigned / reset
 * PUT /api/admin/valid-ids/:id
 * body: { assigned: false }
 */
router.put("/valid-ids/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { assigned } = req.body;

    const validId = await ValidId.findById(id);
    if (!validId) {
      return res
        .status(404)
        .json({ success: false, message: "ID tidak ditemukan" });
    }

    if (assigned === false) {
      validId.assigned = false;
      validId.assignedTo = null;
    } else if (assigned === true && !validId.assignedTo) {
      validId.assigned = true;
    }

    await validId.save();
    console.log("♻️ [PUT] ID diperbarui:", validId.idKaryawan);

    res.json({
      success: true,
      message: "✅ Valid ID diperbarui",
      data: validId,
    });
  } catch (err) {
    console.error("❌ [PUT] Error update Valid ID:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * ✅ DELETE Valid ID
 * DELETE /api/admin/valid-ids/:id
 */
router.delete("/valid-ids/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const validId = await ValidId.findByIdAndDelete(id);
    if (!validId) {
      return res
        .status(404)
        .json({ success: false, message: "ID tidak ditemukan" });
    }

    console.log("🗑️ [DELETE] ID dihapus:", validId.idKaryawan);

    res.json({ success: true, message: "✅ Valid ID dihapus" });
  } catch (err) {
    console.error("❌ [DELETE] Error hapus Valid ID:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
