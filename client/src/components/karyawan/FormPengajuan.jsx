import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FormPengajuan() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama: '',
    nik: '',
    jabatan: '',
    lamaBekerjaTahun: '',
    lamaBekerjaBulan: '',
    tanggungan: '',
    gaji: '',
    tanggalPengajuan: '',
    nominal: '',
    alasan: '',
    tenor: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('⚠️ Anda harus login terlebih dahulu!');
      return;
    }

    const totalBulanBekerja =
      parseInt(form.lamaBekerjaTahun || 0) * 12 +
      parseInt(form.lamaBekerjaBulan || 0);

    // ✅ Perbarui logika konversi kisaran gaji
    let gajiFinal = form.gaji;
    if (gajiFinal && gajiFinal.includes('-')) {
      const [min, max] = gajiFinal.split('-').map(Number);
      gajiFinal = Math.round((min + max) / 2);
    } else if (gajiFinal === '<2500000') {
      gajiFinal = 2000000;
    } else if (gajiFinal === '>7000000') {
      gajiFinal = 7500000;
    } else {
      gajiFinal = parseInt(gajiFinal || 0);
    }

    const finalData = {
      ...form,
      gaji: gajiFinal,
      totalBulanBekerja,
      user: user?._id || user?.idKaryawan,
    };

    try {
      const res = await axios.post(
        'http://localhost:5000/api/pengajuan',
        finalData
      );
      console.log('✅ Respon backend:', res.data);
      alert('✅ Pengajuan berhasil dikirim!');
      navigate('/karyawan'); // kembali otomatis
    } catch (err) {
      console.error('❌ Gagal kirim:', err.response?.data || err.message);
      alert(
        '❌ Gagal mengirim pengajuan: ' +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-red-50 py-12 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-white text-red-700 px-8 py-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-center">
            📝 Form Pengajuan Dana Darurat
          </h2>
          <p className="text-center text-sm text-gray-500 mt-1">
            Lengkapi data berikut untuk mengajukan dana darurat
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Nama */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
            />
          </div>

          {/* NIK */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              NIK
            </label>
            <input
              type="text"
              name="nik"
              value={form.nik}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
            />
          </div>

          {/* Jabatan */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Jabatan
            </label>
            <select
              name="jabatan"
              value={form.jabatan}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-lg bg-white focus:ring-2 focus:ring-red-400 outline-none"
            >
              <option value="">-- Pilih Jabatan --</option>
              <option value="Kurir">Kurir</option>
              <option value="Staff Gudang">Staff Gudang</option>
            </select>
          </div>

          {/* Lama Bekerja */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Lama Bekerja (Tahun)
            </label>
            <select
              name="lamaBekerjaTahun"
              value={form.lamaBekerjaTahun}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg bg-white focus:ring-2 focus:ring-red-400 outline-none"
            >
              <option value="">-- Pilih Tahun --</option>
              {Array.from({ length: 7 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} Tahun
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Lama Bekerja (Bulan)
            </label>
            <select
              name="lamaBekerjaBulan"
              value={form.lamaBekerjaBulan}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg bg-white focus:ring-2 focus:ring-red-400 outline-none"
            >
              <option value="">-- Pilih Bulan --</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} Bulan
                </option>
              ))}
            </select>
          </div>

          {/* Gaji */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Kisaran Gaji Bulanan
            </label>
            <select
              name="gaji"
              value={form.gaji}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-lg bg-white focus:ring-2 focus:ring-red-400 outline-none"
            >
              <option value="">-- Pilih Kisaran Gaji --</option>
              <option value="<2500000">Kurang dari Rp 2.500.000</option>
              <option value="2500000-3499999">
                Rp 2.500.000 – Rp 3.499.999
              </option>
              <option value="3500000-4999999">
                Rp 3.500.000 – Rp 4.999.999
              </option>
              <option value="5000000-6999999">
                Rp 5.000.000 – Rp 6.999.999
              </option>
              <option value=">7000000">Lebih dari Rp 7.000.000</option>
            </select>
          </div>

          {/* Tanggungan */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Jumlah Tanggungan
            </label>
            <select
              name="tanggungan"
              value={form.tanggungan}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg bg-white focus:ring-2 focus:ring-red-400 outline-none"
            >
              <option value="">-- Pilih Tanggungan --</option>
              <option value="0">Tidak ada</option>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} Orang
                </option>
              ))}
            </select>
          </div>

          {/* Tanggal Pengajuan */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tanggal Pengajuan
            </label>
            <input
              type="date"
              name="tanggalPengajuan"
              value={form.tanggalPengajuan}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
            />
          </div>

          {/* Nominal */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nominal Dana
            </label>
            <select
              name="nominal"
              value={form.nominal}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-lg bg-white focus:ring-2 focus:ring-red-400 outline-none"
            >
              <option value="">-- Pilih Nominal --</option>
              <option value="300000">Rp 300.000</option>
              <option value="500000">Rp 500.000</option>
              <option value="700000">Rp 700.000</option>
              <option value="1000000">Rp 1.000.000</option>
            </select>
          </div>

          {/* Tenor */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tenor (bulan)
            </label>
            <select
              name="tenor"
              value={form.tenor}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-lg bg-white focus:ring-2 focus:ring-red-400 outline-none"
            >
              <option value="">-- Pilih Tenor --</option>
              <option value="1">1 Bulan</option>
              <option value="2">2 Bulan</option>
              <option value="3">3 Bulan</option>
            </select>
          </div>

          {/* Alasan */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Alasan Pengajuan
            </label>
            <textarea
              name="alasan"
              value={form.alasan}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-red-400 outline-none h-24 resize-none"
            />
          </div>

          {/* Tombol Submit */}
          <div className="col-span-2 mt-6">
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition-all shadow-md"
            >
              🚀 Kirim Pengajuan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormPengajuan;
