import Pengajuan from '../models/Pengajuan.js';
import Pinjaman from '../models/Pinjaman.js';
import JadwalPotongan from '../models/JadwalPotongan.js';

// Lihat semua pengajuan, ranking WP
export const getAllPengajuan = async (req, res) => {
  try {
    const pengajuan = await Pengajuan.find()
      .populate('user', 'name email')
      .sort({ wpScore: -1 }); // urut descending
    res.json(pengajuan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve / Reject pengajuan
export const updateStatusPengajuan = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "approved" atau "rejected"
    const pengajuan = await Pengajuan.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.json(pengajuan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Pinjaman CRUD
export const getPinjaman = async (req, res) => {
  try {
    const pinjaman = await Pinjaman.find();
    res.json(pinjaman);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createPinjaman = async (req, res) => {
  try {
    const { pengajuanId, nominal, tenor, cicilanPerBulan } = req.body;

    // Ambil data pengajuan
    const pengajuan = await Pengajuan.findById(pengajuanId);
    if (!pengajuan) {
      return res.status(404).json({ message: 'Pengajuan tidak ditemukan' });
    }

    // Gunakan user dari pengajuan (karyawan yg meminjam)
    const pinjaman = new Pinjaman({
      user: pengajuan.user, // ✅ BUKAN req.user !!!
      pengajuan: pengajuan._id,
      nominal,
      tenor,
      cicilanPerBulan,
      status: 'Berjalan', // atau "Disetujui" tergantung alur kamu
    });

    await pinjaman.save();

    res.status(201).json(pinjaman);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePinjaman = async (req, res) => {
  try {
    const { id } = req.params;
    const pinjaman = await Pinjaman.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(pinjaman);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePinjaman = async (req, res) => {
  try {
    const { id } = req.params;
    await Pinjaman.findByIdAndDelete(id);
    res.json({ message: 'Pinjaman deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Jadwal Potongan CRUD
export const getJadwal = async (req, res) => {
  try {
    const jadwal = await JadwalPotongan.find();
    res.json(jadwal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createJadwal = async (req, res) => {
  try {
    const jadwal = new JadwalPotongan(req.body);
    await jadwal.save();
    res.status(201).json(jadwal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateJadwal = async (req, res) => {
  try {
    const { id } = req.params;
    const jadwal = await JadwalPotongan.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(jadwal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteJadwal = async (req, res) => {
  try {
    const { id } = req.params;
    await JadwalPotongan.findByIdAndDelete(id);
    res.json({ message: 'Jadwal deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
