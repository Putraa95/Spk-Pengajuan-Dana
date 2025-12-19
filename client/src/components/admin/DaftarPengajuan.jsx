import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DaftarPengajuan() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('');
  const [catatan, setCatatan] = useState('');
  const navigate = useNavigate();

  const merahTua = '#C21807';
  const abuTua = '#2E2E2E';

  // ======================
  // Ambil data pengajuan
  // ======================
  const fetchPengajuan = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/pengajuan');
      // Backend balikan { message, data }
      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert('Gagal ambil data pengajuan');
    }
  };

  useEffect(() => {
    fetchPengajuan();
  }, []);

  // ======================
  // Proses ACC / Tolak
  // ======================
  const proses = async (id) => {
    if (!status) {
      alert('Pilih status dulu');
      return;
    }

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/pengajuan/${id}`,
        {
          status,
          catatanAdmin: catatan,
        }
      );
      alert(res.data.message);
      setSelected(null);
      setStatus('');
      setCatatan('');
      fetchPengajuan();
    } catch (err) {
      console.error(err);
      alert('Gagal update pengajuan');
    }
  };

  // ======================
  // Hapus pengajuan
  // ======================
  const hapus = async (id) => {
    if (!window.confirm('Yakin ingin menghapus pengajuan ini?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/pengajuan/${id}`);
      alert('Pengajuan berhasil dihapus');
      fetchPengajuan();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus pengajuan');
    }
  };

  // ======================
  // Tentukan kelayakan berdasar skor WP
  // ======================
  const cekKelayakan = (nilai) => {
    if (nilai >= 1.0) return 'Sangat Layak';
    if (nilai >= 0.75) return 'Layak';
    if (nilai >= 0.55) return 'Pertimbangkan';
    return 'Tidak Layak';
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: abuTua, color: 'white' }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📋 Daftar Pengajuan</h2>
        <button
          onClick={() => navigate('/admin')}
          className="px-4 py-2 rounded-lg shadow-md"
          style={{ backgroundColor: merahTua, color: 'white' }}
        >
          Keluar ke Dashboard
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full text-sm border-collapse">
          <thead style={{ backgroundColor: '#3B3B3B' }}>
            <tr>
              <th className="p-3 text-left text-white">Nama</th>
              <th className="p-3 text-left text-white">Nominal</th>
              <th className="p-3 text-left text-white">Skor WP</th>
              <th className="p-3 text-left text-white">Kelayakan</th>
              <th className="p-3 text-left text-white">Status</th>
              <th className="p-3 text-center text-white">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d) => (
              <tr
                key={d._id}
                className="hover:bg-gray-700 transition border-b border-gray-600"
              >
                <td className="p-3">{d.nama || '-'}</td>
                <td className="p-3">
                  Rp {Number(d.nominal || 0).toLocaleString('id-ID')}
                </td>
                <td className="p-3">
                  {d.hasilWP?.toFixed(3) || d.nilaiWP?.toFixed(3) || '-'}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded ${
                      d.statusWP === 'Sangat Layak'
                        ? 'bg-green-600 text-white'
                        : d.statusWP === 'Layak'
                        ? 'bg-blue-600 text-white'
                        : d.statusWP === 'Pertimbangkan'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {d.statusWP || 'Tidak Layak'}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded ${
                      d.status === 'Disetujui'
                        ? 'bg-green-700 text-white'
                        : d.status === 'Ditolak'
                        ? 'bg-red-700 text-white'
                        : 'bg-gray-600 text-white'
                    }`}
                  >
                    {d.status || 'Sedang Proses'}
                  </span>
                </td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => setSelected(d)}
                    className="px-3 py-1 rounded bg-red-700 text-white hover:bg-red-800 transition"
                  >
                    Proses
                  </button>
                  {(d.status === 'Disetujui' || d.status === 'Ditolak') && (
                    <button
                      onClick={() => hapus(d._id)}
                      className="px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600 transition"
                    >
                      Hapus
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Proses */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg w-96 shadow-lg">
            <h3 className="font-bold text-lg mb-3">
              Proses Pengajuan: {selected.nama}
            </h3>
            <p>Nominal: Rp {selected.nominal.toLocaleString('id-ID')}</p>
            <p>
              Skor WP:{' '}
              {selected.hasilWP?.toFixed(3) || selected.nilaiWP?.toFixed(3)} (
              {cekKelayakan(selected.hasilWP || selected.nilaiWP)})
            </p>

            {/* Pilihan status */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="setuju"
                  name="status"
                  value="Disetujui"
                  checked={status === 'Disetujui'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <label
                  htmlFor="setuju"
                  className="text-sm font-medium text-green-700"
                >
                  ✅ Disetujui (Dana akan dicairkan, cicilan otomatis)
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="tolak"
                  name="status"
                  value="Ditolak"
                  checked={status === 'Ditolak'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <label
                  htmlFor="tolak"
                  className="text-sm font-medium text-red-700"
                >
                  ❌ Ditolak (Tidak memenuhi kriteria)
                </label>
              </div>
            </div>

            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full border p-2 mt-3 rounded"
              placeholder="Catatan Admin (opsional)"
            />

            <div className="flex gap-2 justify-end mt-4">
              <button
                onClick={() => setSelected(null)}
                className="px-3 py-1 rounded bg-gray-400 text-white"
              >
                Batal
              </button>
              <button
                onClick={() => proses(selected._id)}
                disabled={!status}
                className={`px-3 py-1 rounded text-white ${
                  status
                    ? 'bg-[#C21807] hover:bg-red-800'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DaftarPengajuan;
