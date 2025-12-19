const mongoose = require("mongoose");

const JadwalSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  nik: { type: String, required: true },
  bulan: { type: String, required: true },
  nominal: { type: Number, required: true },
  status: {
    type: String,
    enum: ["belum_dipotong", "sudah_dipotong"],
    default: "belum_dipotong",
  },
});

module.exports = mongoose.model("JadwalPotongan", JadwalSchema);
