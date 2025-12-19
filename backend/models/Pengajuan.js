const mongoose = require('mongoose');

const CicilanSchema = new mongoose.Schema({
  bulanKe: { type: Number, required: true },
  nominalPerBulan: { type: Number, required: true },
  jatuhTempo: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Belum Bayar', 'Lunas'],
    default: 'Belum Bayar',
  },
  tanggalBayar: { type: Date },
});

const PengajuanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nama: { type: String, required: true },
    nik: { type: String },
    jabatan: { type: String },
    lamaBekerjaTahun: { type: Number, default: 0 },
    lamaBekerjaBulan: { type: Number, default: 0 },
    totalBulanBekerja: { type: Number, default: 0 },
    tanggungan: { type: Number, default: 0 },
    gaji: { type: Number, required: true },
    tanggalPengajuan: { type: Date, default: Date.now },
    tanggalCair: { type: Date },
    nominal: { type: Number, required: true },
    tenor: { type: Number, default: 1 },
    alasan: { type: String },
    cicilan: [CicilanSchema],
    hasilWP: { type: Number, default: 0 },
    statusWP: {
      type: String,
      enum: ['Sangat Layak', 'Layak', 'Pertimbangkan', 'Tidak Layak'],
      default: 'Tidak Layak',
    },
    status: {
      type: String,
      enum: ['Sedang Proses', 'Disetujui', 'Ditolak', 'Lunas'],
      default: 'Sedang Proses',
    },
    catatanAdmin: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pengajuan', PengajuanSchema);
