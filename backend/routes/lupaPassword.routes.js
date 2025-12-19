const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const LupaPassword = require("../models/LupaPassword");
const User = require("../models/User");

// ============= Ajukan Lupa Password (Karyawan) ============
router.post("/ajukan", async (req, res) => {
  try {
    const { nama, karyawanId } = req.body;

    // ✅ cek user berdasarkan idKaryawan + nama
    const user = await User.findOne({ idKaryawan: karyawanId, nama });
    if (!user)
      return res.status(404).json({ msg: "Data karyawan tidak ditemukan" });

    // simpan request lupa password
    const request = new LupaPassword({
      nama,
      karyawanId,
      status: "Pending",
    });
    await request.save();

    res.json({
      msg: "Permintaan terkirim, tunggu admin proses maksimal 1 jam",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Gagal mengajukan lupa password" });
  }
});

// ============= Daftar Permintaan (Admin) ============
router.get("/", async (req, res) => {
  try {
    const requests = await LupaPassword.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Gagal mengambil data" });
  }
});

// ============= Admin Reset Password Baru ============
router.post("/reset/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const request = await LupaPassword.findById(id);
    if (!request)
      return res.status(404).json({ msg: "Permintaan tidak ditemukan" });

    // ✅ cari user berdasarkan idKaryawan
    const user = await User.findOne({ idKaryawan: request.karyawanId });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    // password default baru (bisa diganti random generator juga)
    const newPassword = "123456";
    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    await user.save();

    // update request
    request.status = "Selesai";
    request.passwordLama = newPassword; // ✅ simpan password baru (plain)
    await request.save();

    res.json({
      msg: `Password untuk karyawan ${request.nama} berhasil direset. Default password sekarang: ${newPassword}.`,
      passwordDefault: newPassword,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Gagal reset password" });
  }
});

// ============= Karyawan Cek Status ============
router.get("/status/:idKaryawan", async (req, res) => {
  try {
    const { idKaryawan } = req.params;

    // ✅ ambil request terbaru berdasarkan idKaryawan
    const request = await LupaPassword.findOne({ karyawanId: idKaryawan }).sort(
      { createdAt: -1 }
    );

    if (!request) return res.status(404).json({ msg: "Tidak ada permintaan" });

    if (request.status === "Pending") {
      return res.json({
        msg: "Permintaan masih menunggu admin. Silakan tunggu maksimal 1 jam.",
      });
    }

    // ✅ Ubah response agar jelas
    return res.json({
      msg: `Silakan login menggunakan password default "${request.passwordLama}" lalu segera ganti dengan password baru Anda.`,
      passwordDefault: request.passwordLama,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Gagal cek status" });
  }
});

module.exports = router;
