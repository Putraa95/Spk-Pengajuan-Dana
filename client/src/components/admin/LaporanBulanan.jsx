import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LaporanBulanan() {
  const [laporan, setLaporan] = useState([]);
  const [bulan, setBulan] = useState('');
  const [tahun, setTahun] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const warnaMerahTua = '#C21807';
  const warnaAbuTua = '#1E1E1E';

  // ✅ Gunakan useCallback agar tidak trigger ulang useEffect
  const fetchLaporan = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/laporan-bulanan');
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setLaporan(data);
      setError('');
    } catch (err) {
      console.error('❌ Gagal fetch laporan:', err);
      setError('Gagal memuat data laporan. Periksa koneksi server.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Load data pertama kali
  useEffect(() => {
    fetchLaporan();
  }, [fetchLaporan]);

  // Pisahkan data
  const berjalan = laporan.filter((d) => d.status !== 'Lunas');
  const lunas = laporan.filter((d) => d.status === 'Lunas');

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: warnaAbuTua, color: 'white' }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold">📊 Laporan Pinjaman Bulanan</h2>
        <button
          onClick={() => navigate('/admin')}
          className="px-4 py-2 rounded-lg shadow-md"
          style={{ backgroundColor: warnaMerahTua, color: 'white' }}
        >
          ⬅ Kembali ke Dashboard
        </button>
      </div>

      {/* Filter Bulan & Tahun */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={bulan}
          onChange={(e) => setBulan(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white"
        >
          <option value="">-- Pilih Bulan --</option>
          {[
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember',
          ].map((b, i) => (
            <option key={i + 1} value={i + 1}>
              {b}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={tahun}
          onChange={(e) => setTahun(e.target.value)}
          placeholder="Tahun (misal: 2025)"
          className="p-2 rounded bg-gray-800 text-white"
        />

        <button
          onClick={fetchLaporan}
          className="px-4 py-2 rounded bg-green-600 hover:bg-green-700"
        >
          🔍 Tampilkan
        </button>
      </div>

      {/* Loading & Error */}
      {loading ? (
        <div className="text-center py-10 text-gray-300">
          🔄 Memuat data laporan...
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500 font-semibold">
          {error}
        </div>
      ) : (
        <>
          {/* === PINJAMAN BERJALAN === */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-3 text-yellow-400">
              📌 Pinjaman Masih Berjalan
            </h3>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="w-full text-sm border-collapse">
                <thead style={{ backgroundColor: '#333' }}>
                  <tr>
                    <th className="p-3 text-left">Nama</th>
                    <th className="p-3 text-left">Nominal</th>
                    <th className="p-3 text-left">Tenor</th>
                    <th className="p-3 text-left">Cicilan Lunas</th>
                    <th className="p-3 text-left">Sisa Cicilan</th>
                    <th className="p-3 text-left">Total Bayar</th>
                    <th className="p-3 text-left">Sisa Nominal</th>
                    <th className="p-3 text-left">Tanggal Pinjam</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {berjalan.length > 0 ? (
                    berjalan.map((d) => (
                      <tr
                        key={d._id}
                        className="hover:bg-gray-800 transition border-b border-gray-700"
                      >
                        <td className="p-3">{d.nama}</td>
                        <td className="p-3">
                          Rp {d.nominal?.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3">{d.tenor} bulan</td>
                        <td className="p-3">{d.cicilanLunas}x</td>
                        <td className="p-3">{d.sisaCicilan}x</td>
                        <td className="p-3">
                          Rp {d.totalBayar?.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3">
                          Rp {d.sisaNominal?.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3">
                          {new Date(d.tanggalPinjam).toLocaleDateString(
                            'id-ID'
                          )}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-600 text-white">
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        className="text-center py-4 text-gray-400 italic"
                      >
                        Tidak ada pinjaman berjalan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* === PINJAMAN LUNAS === */}
          <div>
            <h3 className="text-xl font-semibold mb-3 text-green-400">
              ✅ Pinjaman Sudah Lunas
            </h3>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="w-full text-sm border-collapse">
                <thead style={{ backgroundColor: '#333' }}>
                  <tr>
                    <th className="p-3 text-left">Nama</th>
                    <th className="p-3 text-left">Nominal</th>
                    <th className="p-3 text-left">Tenor</th>
                    <th className="p-3 text-left">Total Bayar</th>
                    <th className="p-3 text-left">Tanggal Pinjam</th>
                    <th className="p-3 text-left">Tanggal Update</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lunas.length > 0 ? (
                    lunas.map((d) => (
                      <tr
                        key={d._id}
                        className="hover:bg-gray-800 transition border-b border-gray-700"
                      >
                        <td className="p-3">{d.nama}</td>
                        <td className="p-3">
                          Rp {d.nominal?.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3">{d.tenor} bulan</td>
                        <td className="p-3">
                          Rp {d.totalBayar?.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3">
                          {new Date(d.tanggalPinjam).toLocaleDateString(
                            'id-ID'
                          )}
                        </td>
                        <td className="p-3">
                          {new Date(d.tanggalUpdate).toLocaleDateString(
                            'id-ID'
                          )}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-green-600 text-white">
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-4 text-gray-400 italic"
                      >
                        Belum ada pinjaman lunas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LaporanBulanan;
