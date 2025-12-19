// backend/models/ValidId.js
const mongoose = require("mongoose");

const ValidIdSchema = new mongoose.Schema({
  idKaryawan: { type: String, required: true, unique: true }, // e.g. LS0000104965
  assigned: { type: Boolean, default: false },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  note: { type: String }, // opsional: catatan / nama asli
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ValidId", ValidIdSchema);
