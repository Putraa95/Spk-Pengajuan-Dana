const express = require("express");
const router = express.Router();
const Jadwal = require("../models/JadwalPotongan");

// GET semua jadwal
router.get("/", async (req, res) => {
  try {
    const data = await Jadwal.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST tambah jadwal
router.post("/", async (req, res) => {
  try {
    const jadwal = new Jadwal(req.body);
    await jadwal.save();
    res.json(jadwal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update status jadwal
router.put("/:id", async (req, res) => {
  try {
    const updated = await Jadwal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
