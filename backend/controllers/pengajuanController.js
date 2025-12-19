const Pengajuan = require('../models/Pengajuan');

//
// ====== Weighted Product (WP) CONFIG ======
//

// Bobot (diringankan untuk masa kerja)
const weights = {
  gaji: 0.35,
  totalBulanBekerja: 0.15,
  tanggungan: 0.3,
  catatan: 0.2,
};

// Fungsi skor gaji
function skorGaji(gaji) {
  if (gaji < 2000000) return 0.6;
  if (gaji < 4000000) return 0.8;
  return 1.0;
}

// Fungsi skor masa kerja
function skorMasaKerja(totalBulan) {
  if (totalBulan < 12) return 0.6; // < 1 tahun
  if (totalBulan < 24) return 0.75; // 1–2 tahun
  if (totalBulan < 36) return 0.9; // 2–3 tahun
  return 1.0; // > 3 tahun
}

// Fungsi skor tanggungan
function skorTanggungan(t) {
  if (t === 0) return 0.6;
  if (t <= 2) return 0.8;
  return 1.0;
}

// Fungsi skor catatan (sementara default "baik")
function skorCatatan(riwayat = 'baik') {
  return riwayat === 'baik' ? 1.0 : 0.7;
}

// Fungsi hitung WP
function hitungWP(p) {
  const s = {
    gaji: skorGaji(p.gaji) ** weights.gaji,
    totalBulanBekerja:
      skorMasaKerja(p.totalBulanBekerja) ** weights.totalBulanBekerja,
    tanggungan: skorTanggungan(p.tanggungan) ** weights.tanggungan,
    catatan: skorCatatan('baik') ** weights.catatan,
  };

  const score = s.gaji * s.totalBulanBekerja * s.tanggungan * s.catatan;
  return score;
}

//
// ====== CONTROLLERS ======
//

// CREATE pengajuan baru + hitung WP
const Pengajuan = require('../models/Pengajuan');

// Ambil laporan bulanan
exports.getLaporanBulanan = async (req, res) => {
  try {
    const pinjaman = await Pinjaman.find()
      .populate('user', 'nama idKaryawan jabatan')
      .populate('pengajuan', 'tanggalPengajuan alasan');

    const laporan = pinjaman.map((p) => {
      const totalCicilan = p.riwayatCicilan?.length || 0;
      const cicilanDibayar =
        p.riwayatCicilan?.filter((c) => c.status === 'Lunas').length || 0;
      const sisaCicilan = totalCicilan - cicilanDibayar;

      return {
        _id: p._id,
        nama: p.user?.nama || '-',
        jabatan: p.user?.jabatan || '-',
        nominal: p.nominal || 0,
        tenor: p.tenor || 0,
        cicilanPerBulan: p.cicilanPerBulan || 0,
        status: p.status || 'Tidak Diketahui',
        tanggalPengajuan: p.pengajuan?.tanggalPengajuan || '-',
        mulaiCicil: p.mulaiCicil || '-',
        totalCicilan,
        cicilanDibayar,
        sisaCicilan,
      };
    });

    res.json({ success: true, data: laporan });
  } catch (err) {
    console.error('❌ ERROR getLaporanBulanan:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil laporan bulanan',
      error: err.message,
    });
  }
};

// GET semua pengajuan
exports.getAllPengajuan = async (req, res) => {
  try {
    const daftar = await Pengajuan.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(daftar);
  } catch (err) {
    console.error('❌ Error getAllPengajuan:', err);
    res.status(500).json({ message: 'Gagal ambil daftar pengajuan' });
  }
};

// GET pengajuan per user
exports.getPengajuanByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const pengajuan = await Pengajuan.find({ user: userId }).sort({
      createdAt: -1,
    });
    res.json(pengajuan);
  } catch (err) {
    console.error('❌ Error getPengajuanByUser:', err);
    res.status(500).json({ message: 'Gagal ambil pengajuan user' });
  }
};

// GET pengajuan detail by ID
exports.getPengajuanById = async (req, res) => {
  try {
    const { id } = req.params;
    const pengajuan = await Pengajuan.findById(id).populate(
      'user',
      'name email'
    );
    if (!pengajuan) {
      return res.status(404).json({ message: 'Pengajuan tidak ditemukan' });
    }
    res.json(pengajuan);
  } catch (err) {
    console.error('❌ Error getPengajuanById:', err);
    res.status(500).json({ message: 'Gagal ambil detail pengajuan' });
  }
};

// DELETE pengajuan
exports.deletePengajuan = async (req, res) => {
  try {
    const { id } = req.params;
    const pengajuan = await Pengajuan.findByIdAndDelete(id);
    if (!pengajuan) {
      return res.status(404).json({ message: 'Pengajuan tidak ditemukan' });
    }
    res.json({ message: 'Pengajuan berhasil dihapus' });
  } catch (err) {
    console.error('❌ Error deletePengajuan:', err);
    res.status(500).json({ message: 'Gagal menghapus pengajuan' });
  }
};

// UPDATE CICILAN (fungsi tambahan)
exports.updateCicilan = async (req, res) => {
  try {
    const { id, bulanKe } = req.params; // id = id pengajuan
    const { status } = req.body; // "Lunas" atau "Belum Bayar"

    const pengajuan = await Pengajuan.findById(id);
    if (!pengajuan) {
      return res.status(404).json({ message: 'Pengajuan tidak ditemukan' });
    }

    // cari cicilan berdasarkan bulanKe
    const cicilan = pengajuan.cicilan.find((c) => c.bulanKe == bulanKe);
    if (!cicilan) {
      return res.status(404).json({ message: 'Cicilan tidak ditemukan' });
    }

    // update status cicilan
    cicilan.status = status;
    if (status === 'Lunas') {
      cicilan.tanggalBayar = new Date();
    }

    // cek apakah semua cicilan sudah lunas
    const semuaLunas = pengajuan.cicilan.every((c) => c.status === 'Lunas');
    if (semuaLunas) {
      pengajuan.status = 'Lunas';
    }

    await pengajuan.save();

    res.json({ message: 'Cicilan berhasil diupdate', pengajuan });
  } catch (err) {
    console.error('❌ Error updateCicilan:', err);
    res.status(500).json({ message: 'Gagal update cicilan' });
  }
};
