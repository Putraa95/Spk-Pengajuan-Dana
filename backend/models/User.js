const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  idKaryawan: { type: String, required: true },
  jabatan: { type: String },
  role: { type: String, default: "karyawan" },
  email: { type: String },
  password: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
