const express = require("express");
const ValidId = require("../models/ValidId");

const router = express.Router();

/**

* GET semua Valid ID
  */
router.get("/valid-ids", async (req, res) => {
  try {
    const ids = await ValidId.find().populate("assignedTo", "nama idKaryawan");

    res.json({
      success: true,
      data: ids,
    });
  } catch (err) {
    console.error("GET Valid IDs Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/**

* CREATE Valid ID
  */
router.post("/valid-ids", async (req, res) => {
  try {
    const { idKaryawan, nama, jabatan, email } = req.body;

    if (!idKaryawan || !nama || !jabatan) {
      return res.status(400).json({
        success: false,
        message: "ID Karyawan, Nama dan Jabatan wajib diisi",
      });
    }

    if (!/^LS\d{10}$/.test(idKaryawan)) {
      return res.status(400).json({
        success: false,
        message: "Format ID tidak valid (contoh: LS0000104965)",
      });
    }

    const existing = await ValidId.findOne({
      idKaryawan,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "ID sudah terdaftar",
      });
    }

    const newId = await ValidId.create({
      idKaryawan,
      nama,
      jabatan,
      email,
      status: "Belum Digunakan",
      assignedTo: null,
    });

    res.status(201).json({
      success: true,
      message: "Valid ID berhasil ditambahkan",
      data: newId,
    });
  } catch (err) {
    console.error("POST Valid ID Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/**

* UPDATE Valid ID
  */
router.put("/valid-ids/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { nama, jabatan, email, status } = req.body;

    const validId = await ValidId.findById(id);

    if (!validId) {
      return res.status(404).json({
        success: false,
        message: "ID tidak ditemukan",
      });
    }

    if (nama !== undefined) validId.nama = nama;

    if (jabatan !== undefined) validId.jabatan = jabatan;

    if (email !== undefined) validId.email = email;

    if (status !== undefined) validId.status = status;

    await validId.save();

    res.json({
      success: true,
      message: "Valid ID berhasil diperbarui",
      data: validId,
    });
  } catch (err) {
    console.error("PUT Valid ID Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/**

* RESET STATUS
  */
router.put("/valid-ids/:id/reset", async (req, res) => {
  try {
    const validId = await ValidId.findById(req.params.id);

    if (!validId) {
      return res.status(404).json({
        success: false,
        message: "ID tidak ditemukan",
      });
    }

    validId.status = "Belum Digunakan";
    validId.assignedTo = null;

    await validId.save();

    res.json({
      success: true,
      message: "Status berhasil direset",
      data: validId,
    });
  } catch (err) {
    console.error("RESET Valid ID Error:", err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/**

* DELETE Valid ID
  */
router.delete("/valid-ids/:id", async (req, res) => {
  try {
    const validId = await ValidId.findByIdAndDelete(req.params.id);

    if (!validId) {
      return res.status(404).json({
        success: false,
        message: "ID tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Valid ID berhasil dihapus",
    });
  } catch (err) {
    console.error("DELETE Valid ID Error:", err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
