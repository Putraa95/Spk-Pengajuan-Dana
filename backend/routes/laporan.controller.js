const Pinjaman = require('../models/Pinjaman');

// Ambil laporan bulanan
exports.getLaporanBulanan = async (req, res) => {
  try {
    const pinjaman = await Pinjaman.find().populate(
      'user',
      'nama idKaryawan jabatan'
    );

    const laporan = pinjaman.map((p) => {
      const sisaCicilan = p.riwayatCicilan.filter(
        (c) => c.status === 'Belum Bayar'
      ).length;
      return {
        _id: p._id,
        user: p.user.nama,
        nik: p.nik,
        nominal: p.nominal,
        tenor: p.tenor,
        status: p.status,
        sisaCicilan,
        riwayatCicilan: p.riwayatCicilan,
      };
    });

    res.json({ success: true, data: laporan });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: 'Gagal mengambil laporan bulanan' });
  }
};

// Update status cicilan tertentu
exports.updateCicilan = async (req, res) => {
  try {
    const { id } = req.params;
    const { bulanKe } = req.body;

    const pinjaman = await Pinjaman.findById(id);
    if (!pinjaman)
      return res
        .status(404)
        .json({ success: false, message: 'Pinjaman tidak ditemukan' });

    const cicilan = pinjaman.riwayatCicilan.find((c) => c.bulanKe === bulanKe);
    if (!cicilan)
      return res
        .status(404)
        .json({ success: false, message: 'Cicilan tidak ditemukan' });

    cicilan.status = 'Lunas';
    cicilan.tanggalBayar = new Date();

    if (pinjaman.riwayatCicilan.every((c) => c.status === 'Lunas')) {
      pinjaman.status = 'Lunas';
    }

    await pinjaman.save();
    res.json({ success: true, message: 'Cicilan diperbarui', data: pinjaman });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Gagal update cicilan' });
  }
};
