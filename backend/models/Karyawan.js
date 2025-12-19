const mongoose = require("mongoose");

const KaryawanSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  nik: { type: String, required: true, unique: true },
  jabatan: { type: String, required: true },
  password: { type: String, required: true }, // bisa untuk login nanti
});

module.exports = mongoose.model("Karyawan", KaryawanSchema);
