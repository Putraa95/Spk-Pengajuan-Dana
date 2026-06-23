const mongoose = require("mongoose");

const ValidIdSchema = new mongoose.Schema({
  idKaryawan: {
    type: String,
    required: true,
    unique: true,
  },

  nama: {
    type: String,
    required: true,
  },

  jabatan: {
    type: String,
    required: true,
  },

  email: {
    type: String,
  },

  noHp: {
    type: String,
  },

  status: {
    type: String,
    enum: ["Belum Digunakan", "Sudah Digunakan"],
    default: "Belum Digunakan",
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ValidId", ValidIdSchema);
