// 📁 routes/pengajuan.routes.js
const express = require('express');
const router = express.Router();
const Pengajuan = require('../models/Pengajuan');
const Pinjaman = require('../models/Pinjaman');
const { hitungWP } = require('../utils/wp');

// ====================
// 📌 CREATE Pengajuan Baru
// ====================
router.post('/', async (req, res) => {
  try {
    const {
      nama,
      nik,
      jabatan,
      gaji,
      totalBulanBekerja,
      tanggungan,
      nominal,
      tenor,
      user,
    } = req.body;

    if (
      !nama ||
      !nik ||
      !jabatan ||
      !gaji ||
      !totalBulanBekerja ||
      !nominal ||
      !tenor
    ) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    // 🔢 Proses hitung WP
    const hasilWP = hitungWP({
      gaji: Number(gaji),
      lamaKerja: Number(totalBulanBekerja),
      tanggungan: Number(tanggungan || 0),
      nominal: Number(nominal),
      tenor: Number(tenor),
    });

    // 💾 Simpan data pengajuan
    const pengajuan = new Pengajuan({
      nama,
      nik,
      jabatan,
      gaji,
      totalBulanBekerja,
      tanggungan,
      nominal,
      tenor,
      hasilWP: hasilWP.hasil,
      nilaiWP: hasilWP.nilai,
      statusWP: hasilWP.statusWP,
      status: 'Sedang Proses',
      tanggalPengajuan: new Date(),
      user,
    });

    await pengajuan.save();

    res.status(201).json({
      success: true,
      message: 'Pengajuan berhasil disimpan',
      data: pengajuan,
    });
  } catch (err) {
    console.error('❌ Error POST pengajuan:', err);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: err.message,
    });
  }
});

// ====================
// 📌 GET Semua Pengajuan (Admin)
// ====================
router.get('/', async (req, res) => {
  try {
    const pengajuan = await Pengajuan.find()
      .populate('user', 'nama idKaryawan jabatan')
      .sort({ tanggalPengajuan: -1 });
    res.json({ success: true, data: pengajuan });
  } catch (err) {
    console.error('❌ Gagal ambil pengajuan:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal ambil pengajuan',
      error: err.message,
    });
  }
});

// ====================
// 📌 PATCH Update Status Pengajuan (Admin)
// ====================
router.patch('/:id', async (req, res) => {
  try {
    const { status, catatanAdmin, tanggalCair } = req.body;
    const pengajuan = await Pengajuan.findById(req.params.id).populate('user');

    if (!pengajuan)
      return res.status(404).json({ message: 'Pengajuan tidak ditemukan' });

    // 🟡 Update status umum (baik Disetujui atau Ditolak)
    pengajuan.status = status || pengajuan.status;
    if (catatanAdmin) pengajuan.catatanAdmin = catatanAdmin;
    if (tanggalCair) pengajuan.tanggalCair = new Date(tanggalCair);

    // ✅ Jika status Disetujui → buat data pinjaman
    if (status === 'Disetujui') {
      const tenor = pengajuan.tenor || 1;
      const nominalPerBulan = Math.round(pengajuan.nominal / tenor);
      const tanggalMulai = pengajuan.tanggalCair || new Date();

      pengajuan.cicilan = [];
      for (let i = 1; i <= tenor; i++) {
        let jatuhTempo = new Date(tanggalMulai);
        jatuhTempo.setMonth(tanggalMulai.getMonth() + i);
        jatuhTempo.setDate(4);
        pengajuan.cicilan.push({
          bulanKe: i,
          nominalPerBulan,
          jatuhTempo,
          status: 'Belum Bayar',
        });
      }

      // 💾 Simpan ke koleksi Pinjaman
      const pinjamanBaru = new Pinjaman({
        pengajuan: pengajuan._id,
        user: pengajuan.user._id,
        nama: pengajuan.nama,
        nik: pengajuan.user.idKaryawan || pengajuan.nik,
        nominal: pengajuan.nominal,
        tenor,
        cicilanPerBulan: nominalPerBulan,
        mulaiCicil: tanggalMulai,
        riwayatCicilan: pengajuan.cicilan.map((c) => ({ ...c })),
        status: 'Berjalan',
      });

      await pinjamanBaru.save();
    }

    // 🚫 Jika status Ditolak
    if (status === 'Ditolak') {
      pengajuan.tanggalCair = null;
      pengajuan.cicilan = [];
    }

    await pengajuan.save();

    res.json({
      success: true,
      message: `Pengajuan diperbarui menjadi status: ${pengajuan.status}`,
      data: pengajuan,
    });
  } catch (err) {
    console.error('❌ Error PATCH pengajuan:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal update pengajuan',
      error: err.message,
    });
  }
});

// ====================
// 📌 GET Pengajuan berdasarkan user (riwayat semua status)
// ====================
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const pengajuan = await Pengajuan.find({ user: userId })
      .sort({ tanggalPengajuan: -1 })
      .lean();

    if (!pengajuan.length) {
      return res.json({
        success: true,
        data: [],
        message: 'Belum ada pengajuan',
      });
    }

    res.json({ success: true, data: pengajuan });
  } catch (err) {
    console.error('❌ Gagal fetch riwayat pengajuan:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal fetch riwayat pengajuan',
      error: err.message,
    });
  }
});
// ====================
// 📌 DELETE Pengajuan
// ====================
router.delete('/:id', async (req, res) => {
  try {
    const pengajuan = await Pengajuan.findById(req.params.id);
    if (!pengajuan)
      return res.status(404).json({ message: 'Pengajuan tidak ditemukan' });

    // Hapus juga data pinjaman jika ada keterkaitan
    await Pinjaman.deleteOne({ pengajuan: pengajuan._id });

    await pengajuan.deleteOne();

    res.json({
      success: true,
      message: 'Pengajuan berhasil dihapus',
    });
  } catch (err) {
    console.error('❌ Gagal hapus pengajuan:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal hapus pengajuan',
      error: err.message,
    });
  }
});

module.exports = router;
