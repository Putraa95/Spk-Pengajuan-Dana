const express = require("express");
const bcrypt = require("bcryptjs"); // pakai bcryptjs
const User = require("../models/User");
const ValidId = require("../models/ValidId");

const router = express.Router();

/**
 * ================= REGISTER =================
 */
router.post("/register", async (req, res) => {
  try {
    const { idKaryawan, nama, password, role } = req.body;

    if (!idKaryawan || !nama || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Semua field wajib diisi" });
    }

    const existing = await User.findOne({ idKaryawan });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, msg: "ID Karyawan sudah terdaftar" });
    }

    if (role === "admin") {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new User({
        idKaryawan,
        nama,
        password: hashedPassword,
        role: "admin",
      });
      await newAdmin.save();

      return res.status(201).json({
        success: true,
        msg: "Registrasi admin berhasil",
        user: {
          _id: newAdmin._id,
          idKaryawan: newAdmin.idKaryawan,
          nama: newAdmin.nama,
          role: newAdmin.role,
        },
      });
    }

    if (!/^LS\d{10}$/.test(idKaryawan)) {
      return res.status(400).json({
        success: false,
        msg: "❌ Format ID tidak valid (harus LS + 10 angka)",
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      idKaryawan,
      nama,
      password: hashed,
      role: "karyawan",
    });

    let validId = await ValidId.findOne({ idKaryawan });
    if (!validId) {
      validId = new ValidId({
        idKaryawan,
        assigned: true,
        assignedTo: newUser._id,
      });
    } else {
      validId.assigned = true;
      validId.assignedTo = newUser._id;
    }
    await validId.save();

    return res.status(201).json({
      success: true,
      msg: "✅ Registrasi karyawan berhasil & masuk ke Valid ID!",
      user: {
        _id: newUser._id,
        idKaryawan: newUser.idKaryawan,
        nama: newUser.nama,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
});

/**
 * ================= LOGIN =================
 */
router.post("/login", async (req, res) => {
  try {
    const { idKaryawan, password } = req.body;

    if (!idKaryawan || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "ID & password wajib diisi" });
    }

    const user = await User.findOne({ idKaryawan });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, msg: "User tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: "Password salah" });
    }

    return res.json({
      success: true,
      msg: "Login berhasil",
      user: {
        _id: user._id,
        idKaryawan: user.idKaryawan,
        nama: user.nama,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
});

/**
 * ================= RESET PASSWORD =================
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { idKaryawan, passwordLama, passwordBaru } = req.body;

    if (!idKaryawan || !passwordLama || !passwordBaru) {
      return res
        .status(400)
        .json({ success: false, msg: "Semua field wajib diisi" });
    }

    const user = await User.findOne({ idKaryawan });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, msg: "User tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(passwordLama, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, msg: "Password lama salah" });
    }

    const hashedPassword = await bcrypt.hash(passwordBaru, 10);
    user.password = hashedPassword;
    await user.save();

    return res.json({ success: true, msg: "✅ Password berhasil direset" });
  } catch (err) {
    console.error("❌ Reset password error:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
});

/**
 * ================= LUPA PASSWORD (ajukan ke admin) =================
 */
router.post("/lupa-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, msg: "User tidak ditemukan" });

    res.json({
      success: true,
      msg: "Permintaan terkirim ke admin (dummy response)",
      info: `Password lama (hashed): ${user.password}`,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Gagal mengajukan lupa password" });
  }
});

module.exports = router;
