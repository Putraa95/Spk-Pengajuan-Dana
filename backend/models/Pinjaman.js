const mongoose = require('mongoose');

// Skema untuk detail cicilan tiap bulan
const CicilanSchema = new mongoose.Schema({
  bulanKe: { type: Number, required: true },
  nominalPerBulan: { type: Number, required: true },
  jatuhTempo: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Belum Bayar', 'Lunas'], // status cicilan per bulan
    default: 'Belum Bayar',
  },
  tanggalBayar: { type: Date },
});

// Skema utama untuk pinjaman
const PinjamanSchema = new mongoose.Schema(
  {
    // Relasi ke user peminjam
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Relasi ke pengajuan yang disetujui
    pengajuan: { type: mongoose.Schema.Types.ObjectId, ref: 'Pengajuan' },

    nominal: { type: Number, required: true }, // total pinjaman
    tenor: { type: Number, required: true }, // lamanya cicilan dalam bulan
    cicilanPerBulan: { type: Number }, // hasil perhitungan otomatis

    // Status umum pinjaman
    status: {
      type: String,
      enum: [
        'Sedang Proses', // masih diverifikasi admin
        'Disetujui', // pengajuan diterima, belum cair
        'Berjalan', // dana cair dan cicilan sedang berjalan ✅
        'Ditolak', // pengajuan tidak disetujui
        'Lunas', // pinjaman selesai dibayar
      ],
      default: 'Sedang Proses',
    },

    mulaiCicil: { type: Date }, // kapan cicilan dimulai
    riwayatCicilan: [CicilanSchema], // daftar cicilan bulanan
  },
  { timestamps: true } // otomatis tambahkan createdAt dan updatedAt
);

// Ekspor model
module.exports = mongoose.model('Pinjaman', PinjamanSchema);
