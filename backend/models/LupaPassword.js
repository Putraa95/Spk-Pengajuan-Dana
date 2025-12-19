const mongoose = require("mongoose");

const LupaPasswordSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    karyawanId: { type: String, required: true },
    status: { type: String, default: "Pending" },
    passwordLama: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LupaPassword", LupaPasswordSchema);
