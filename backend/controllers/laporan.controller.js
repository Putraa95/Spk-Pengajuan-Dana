const Pinjaman = require('../models/Pinjaman');
const User = require('../models/User');

// ==============================
// 📊 Laporan Bulanan (Real-Time)
// ==============================
exports.getLaporanBulanan = async (req, res) => {
  try {
    const { bulan, tahun } = req.query;

    // Default ke bulan & tahun sekarang
    const now = new Date();
    const bulanFilter = bulan ? parseInt(bulan) - 1 : now.getMonth();
    const tahunFilter = tahun ? parseInt(tahun) : now.getFullYear();

    const start = new Date(tahunFilter, bulanFilter, 1);
    const end = new Date(tahunFilter, bulanFilter + 1, 0, 23, 59, 59);

    // Ambil semua data pinjaman yang dibuat pada bulan itu
    const pinjaman = await Pinjaman.find({
      createdAt: { $gte: start, $lte: end },
    }).populate('user', 'nama idKaryawan jabatan');

    const laporan = pinjaman.map((p) => {
      const totalCicilan = p.riwayatCicilan?.length || 0;
      const cicilanLunas =
        p.riwayatCicilan?.filter((c) => c.status === 'Lunas').length || 0;
      const sisaCicilan = totalCicilan - cicilanLunas;

      // Total nominal yang sudah dibayar & sisa
      const totalBayar =
        p.riwayatCicilan
          ?.filter((c) => c.status === 'Lunas')
          .reduce((acc, c) => acc + c.nominalPerBulan, 0) || 0;

      const sisaNominal = p.nominal - totalBayar;

      return {
        _id: p._id,
        nama: p.user?.nama || '-',
        idKaryawan: p.user?.idKaryawan || '-',
        jabatan: p.user?.jabatan || '-',
        nominal: p.nominal,
        tenor: p.tenor,
        cicilanLunas,
        sisaCicilan,
        totalBayar,
        sisaNominal,
        status: p.status,
        tanggalPinjam: p.createdAt,
        tanggalUpdate: p.updatedAt,
      };
    });

    res.json({ success: true, data: laporan });
  } catch (err) {
    console.error('❌ Error getLaporanBulanan:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil laporan bulanan',
    });
  }
};

// ======================================
// 💰 Update Status Cicilan ke "Lunas"
// ======================================
exports.updateCicilan = async (req, res) => {
  try {
    const { id } = req.params; // id pinjaman
    const { bulanKe } = req.body;

    const pinjaman = await Pinjaman.findById(id);
    if (!pinjaman)
      return res.status(404).json({
        success: false,
        message: 'Data pinjaman tidak ditemukan',
      });

    const cicilan = pinjaman.riwayatCicilan.find((c) => c.bulanKe === bulanKe);
    if (!cicilan)
      return res
        .status(404)
        .json({ success: false, message: 'Cicilan tidak ditemukan' });

    // Update status cicilan menjadi Lunas
    cicilan.status = 'Lunas';
    cicilan.tanggalBayar = new Date();

    // Cek jika semua cicilan sudah lunas
    const semuaLunas = pinjaman.riwayatCicilan.every(
      (c) => c.status === 'Lunas'
    );
    if (semuaLunas) {
      pinjaman.status = 'Lunas';
    }

    await pinjaman.save();

    res.json({
      success: true,
      message: 'Cicilan berhasil diperbarui',
      data: pinjaman,
    });
  } catch (err) {
    console.error('❌ Error updateCicilan:', err);
    res
      .status(500)
      .json({ success: false, message: 'Gagal memperbarui cicilan' });
  }
};
