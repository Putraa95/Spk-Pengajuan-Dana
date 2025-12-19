const express = require('express');
const router = express.Router();
const Pinjaman = require('../models/Pinjaman');
const Pengajuan = require('../models/Pengajuan');

//
// ========== GET SEMUA PINJAMAN (ADMIN) ==========
//
router.get('/', async (req, res) => {
  try {
    const pinjaman = await Pinjaman.find()
      .populate('user', 'nama idKaryawan jabatan')
      .populate('pengajuan');
    res.json({ success: true, data: pinjaman });
  } catch (err) {
    console.error('❌ Error GET /api/pinjaman:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//
// ========== GET RIWAYAT PINJAMAN PER USER ==========
//
router.get('/history/:userId', async (req, res) => {
  try {
    const pinjaman = await Pinjaman.find({ user: req.params.userId }).populate(
      'pengajuan'
    );
    const data = pinjaman.map((p) => ({
      _id: p._id,
      nominal: p.nominal,
      status: p.status,
      tenor: p.tenor,
      mulaiCicil: p.mulaiCicil,
      tanggalPengajuan: p.pengajuan?.tanggalPengajuan,
      sisaCicilan: p.riwayatCicilan.filter((c) => c.status === 'Belum Bayar')
        .length,
      riwayatCicilan: p.riwayatCicilan,
    }));
    res.json({ success: true, data });
  } catch (err) {
    console.error('❌ Error GET /history:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//
// ========== PATCH STATUS PINJAMAN (ADMIN KLIK SETUJU/TOLAK) ==========
//
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // status: "Disetujui" atau "Ditolak"

    const pinjaman = await Pinjaman.findById(id).populate('pengajuan');
    if (!pinjaman)
      return res
        .status(404)
        .json({ success: false, message: 'Pinjaman tidak ditemukan' });

    // update status pinjaman
    pinjaman.status = status;
    await pinjaman.save();

    // update status pengajuan biar sinkron
    if (pinjaman.pengajuan) {
      await Pengajuan.findByIdAndUpdate(pinjaman.pengajuan._id, { status });
    }

    res.json({
      success: true,
      message: `Status pinjaman berhasil diubah menjadi ${status}`,
      data: pinjaman,
    });
  } catch (err) {
    console.error('❌ Error PATCH /status:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//
// ========== PATCH CICILAN TERTENTU (PEMBAYARAN MANUAL) ==========
//
router.patch('/:id/cicilan/:bulanKe', async (req, res) => {
  try {
    const { id, bulanKe } = req.params;
    const pinjaman = await Pinjaman.findById(id);
    if (!pinjaman)
      return res
        .status(404)
        .json({ success: false, message: 'Pinjaman tidak ditemukan' });

    const cicilan = pinjaman.riwayatCicilan.find((c) => c.bulanKe == bulanKe);
    if (!cicilan)
      return res
        .status(404)
        .json({ success: false, message: 'Cicilan tidak ditemukan' });

    cicilan.status = 'Lunas';
    cicilan.tanggalBayar = new Date();

    // Jika semua cicilan sudah lunas
    if (pinjaman.riwayatCicilan.every((c) => c.status === 'Lunas')) {
      pinjaman.status = 'Lunas';
    }

    await pinjaman.save();
    res.json({ success: true, message: 'Cicilan diperbarui', data: pinjaman });
  } catch (err) {
    console.error('❌ Error PATCH cicilan:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//
// ========== PATCH (OPSIONAL) RESET STATUS KE “Sedang Proses” ==========
//
router.patch('/:id/reset', async (req, res) => {
  try {
    const pinjaman = await Pinjaman.findById(req.params.id);
    if (!pinjaman)
      return res
        .status(404)
        .json({ success: false, message: 'Pinjaman tidak ditemukan' });

    pinjaman.status = 'Sedang Proses';
    await pinjaman.save();
    res.json({
      success: true,
      message: 'Status direset ke Sedang Proses',
      data: pinjaman,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
