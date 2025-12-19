// 📁 src/pages/DashboardKaryawan.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DashboardKaryawan() {
  const navigate = useNavigate();
  const [setuju, setSetuju] = useState(false);
  const [list, setList] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  // 🔁 Ambil Data Pinjaman
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pengajuanRes, pinjamanRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/pengajuan/user/${user._id}`),
          axios.get(`http://localhost:5000/api/pinjaman/history/${user._id}`),
        ]);

        // Gabungkan semua pengajuan
        const pengajuanDitolak = pengajuanRes.data.data.filter(
          (p) => p.status === 'Ditolak'
        );
        const allData = [...pinjamanRes.data.data, ...pengajuanDitolak];

        setList(allData);
      } catch (err) {
        console.error(
          '❌ Gagal fetch data:',
          err.response?.data || err.message
        );
        alert(
          'Gagal mengambil data: ' +
            (err.response?.data?.message || err.message)
        );
      }
    };

    if (user?._id) fetchData();
  }, [user?._id]);

  const handleCheckboxChange = (e) => setSetuju(e.target.checked);
  const handleAjukan = () => {
    if (!setuju) {
      alert('Silakan setujui syarat dan ketentuan terlebih dahulu.');
      return;
    }
    navigate('/pengajuan');
  };
  const handleTips = () => navigate('/cara-agar-acc');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-200 via-red-300 to-red-600 text-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 to-red-800 text-white py-6 shadow-lg backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold tracking-wide drop-shadow-md">
              📋 Dashboard Karyawan
            </h1>
            <p className="text-sm opacity-90 mt-1">
              Selamat datang,{' '}
              <span className="font-semibold">{user?.nama}</span>
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              navigate('/');
            }}
            className="mt-4 sm:mt-0 bg-white text-red-700 font-semibold px-5 py-2 rounded-xl shadow-md hover:bg-gray-100 transition-all duration-300 hover:scale-105"
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto p-6 space-y-10 animate-fadeIn">
        {/* RIWAYAT PINJAMAN */}
        <section>
          <h2 className="text-xl font-bold mb-4 text-red-800">
            📊 Riwayat Pinjaman
          </h2>
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-x-auto transition-all duration-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b bg-red-50 text-red-800">
                  <th className="py-3 px-4 font-semibold">Mulai Cicilan</th>
                  <th className="py-3 px-4 font-semibold">Jumlah</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Tenor</th>
                  <th className="py-3 px-4 font-semibold">Sisa Cicilan</th>
                </tr>
              </thead>
              <tbody>
                {list.map((d) => (
                  <tr
                    key={d._id}
                    className="border-b hover:bg-red-50 transition-all"
                  >
                    <td className="py-3 px-4">
                      {d.mulaiCicil
                        ? new Date(d.mulaiCicil).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-4">Rp {d.nominal.toLocaleString()}</td>
                    <td
                      className={`px-4 font-medium ${
                        d.status === 'Lunas'
                          ? 'text-green-600'
                          : d.status === 'Berjalan'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {d.status}
                    </td>
                    <td className="px-4">{d.tenor || '-'}</td>
                    <td className="px-4">
                      {d.sisaCicilan !== undefined ? d.sisaCicilan : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 📢 STATUS PENGAJUAN TERBARU */}

        <section>
          <h2 className="text-xl font-bold mb-4 text-red-800">
            📢 Status Pengajuan Terbaru
          </h2>
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg">
            {list.length === 0 ? (
              <p className="text-center py-4 text-gray-500">
                Belum ada pengajuan pinjaman.
              </p>
            ) : (
              list.map((d) => (
                <div
                  key={d._id}
                  className="border-b border-gray-200 py-4 last:border-none"
                >
                  <p
                    className={`text-lg font-semibold ${
                      d.status === 'Disetujui'
                        ? 'text-green-600'
                        : d.status === 'Sedang Proses'
                        ? 'text-yellow-600'
                        : d.status === 'Ditolak'
                        ? 'text-red-600'
                        : d.status === 'Berjalan'
                        ? 'text-blue-600'
                        : 'text-gray-700'
                    }`}
                  >
                    Status: {d.status}
                  </p>

                  {d.status === 'Ditolak' && (
                    <p className="text-red-600 italic mt-1">
                      ❌ Maaf, pengajuan Anda ditolak karena belum memenuhi
                      kriteria pinjaman.
                    </p>
                  )}
                  {d.status === 'Disetujui' && (
                    <p className="text-green-700 font-semibold mt-1">
                      ✅ Selamat! Pengajuan Anda disetujui. Silakan menghadap
                      admin untuk pencairan dana.
                    </p>
                  )}
                  {d.status === 'Berjalan' && (
                    <p className="text-blue-600 font-semibold mt-1">
                      ✅ Pengajuan dana Anda telah disetujui. Silakan menghadap
                      ke bagian{' '}
                      <span className="underline">Admin Keuangan</span>
                      untuk proses pengambilan dana darurat.
                    </p>
                  )}
                  {d.status === 'Lunas' && (
                    <p className="text-gray-700 font-semibold mt-1">
                      🎉 Pinjaman telah lunas. Terima kasih atas pembayaran
                      tepat waktunya.
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* DETAIL CICILAN */}

        {list.map(
          (d) =>
            d.riwayatCicilan &&
            d.riwayatCicilan.length > 0 && (
              <section
                key={d._id}
                className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-md hover:shadow-lg transition-all"
              >
                <h3 className="text-lg font-bold mb-3 text-red-800">
                  💸 Cicilan untuk pinjaman Rp {d.nominal.toLocaleString()}
                </h3>
                <table className="w-full border text-sm rounded-lg overflow-hidden">
                  <thead className="bg-red-50 text-red-800">
                    <tr>
                      <th className="py-2 px-3">Bulan</th>
                      <th className="py-2 px-3">Jatuh Tempo</th>
                      <th className="py-2 px-3">Nominal</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.riwayatCicilan.map((c) => (
                      <tr
                        key={c.bulanKe}
                        className="border-b hover:bg-red-50 transition-all"
                      >
                        <td className="px-3 py-2">{c.bulanKe}</td>
                        <td className="px-3 py-2">
                          {new Date(c.jatuhTempo).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-2">
                          Rp {c.nominalPerBulan.toLocaleString()}
                        </td>
                        <td
                          className={`px-3 py-2 font-medium ${
                            c.status === 'Lunas'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {c.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )
        )}

        {/* INFORMASI */}

        <section className="space-y-4">
          <details className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 hover:shadow-xl">
            <summary className="text-lg font-bold text-red-800 cursor-pointer select-none">
              🔁 Mekanisme Pengembalian Dana
            </summary>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>
                💸 Potong gaji otomatis setiap tanggal <strong>4</strong>.
              </li>
              <li>👨‍💼 Admin keuangan mengecek cicilan sebelum payroll.</li>
              <li>📅 Tenor maksimal 2–3 bulan.</li>
              <li>📈 Maksimal bantuan: Rp 1.000.000.</li>
              <li>
                ✅ <strong>Bunga 0%</strong> – hanya untuk internal.
              </li>
            </ul>
          </details>

          <details className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 hover:shadow-xl">
            <summary className="text-lg font-bold text-red-800 cursor-pointer select-none">
              📆 Contoh Jatuh Tempo & Proses
            </summary>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>🗓️ Cair 2 Juli → potong 4 Agustus</li>
              <li>🗓️ Cair 18 Juli → potong 4 Agustus</li>
              <li>🗓️ Cair 4 Agustus → potong 4 September</li>
            </ul>
            <h2 className="text-lg font-bold mt-5 mb-2 text-red-800">
              ⏱️ Waktu Pemrosesan
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>📆 Senin–Sabtu: maksimal 24 jam.</li>
              <li>🔔 Notifikasi muncul setelah disetujui.</li>
              <li>📴 Minggu → mulai proses Senin.</li>
            </ul>
          </details>

          <details className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 hover:shadow-xl">
            <summary className="text-lg font-bold text-red-800 cursor-pointer select-none">
              💰 Mekanisme Penerimaan & Pelunasan Dana
            </summary>
            <div className="text-sm text-gray-700 mt-3 space-y-3">
              <p>
                Sistem ini berfungsi sebagai{' '}
                <em>SPK (Sistem Pendukung Keputusan)</em> untuk membantu menilai
                kelayakan pengajuan dana karyawan berdasarkan data dan kriteria
                tertentu.
              </p>
              <p>
                Setelah pengajuan <strong>disetujui</strong> melalui sistem,
                pencairan dana dilakukan <strong>di luar aplikasi</strong> —
                langsung oleh <strong>Admin Keuangan</strong>.
              </p>
              <p className="bg-green-50 border-l-4 border-green-500 p-3 rounded-md text-gray-800">
                ✅ <strong>Pengajuan dana Anda telah disetujui.</strong>
                Silakan segera menghadap ke bagian{' '}
                <strong>Admin Keuangan</strong> untuk proses pengambilan dana
                darurat. Tunjukkan bukti status persetujuan di sistem jika
                diperlukan.
              </p>
              <p>
                Apabila karyawan ingin <strong>melunasi lebih awal</strong>,
                silakan melakukan konfirmasi kepada Admin Keuangan agar data
                pelunasan dapat diperbarui di sistem.
              </p>
              <p>
                Walaupun pelunasan dilakukan lebih cepat, sistem tetap mencatat{' '}
                <strong>tanggal jatuh tempo resmi</strong> untuk keperluan
                laporan dan rekap payroll.
              </p>
            </div>
          </details>
        </section>

        {/* PENGAJUAN DANA BARU */}
        <section className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="syarat"
              className="w-5 h-5 text-red-600 focus:ring-red-500 rounded"
              checked={setuju}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="syarat" className="text-sm text-gray-800">
              Saya menyetujui <strong>syarat & ketentuan</strong>
            </label>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
            <button
              onClick={handleTips}
              className="w-full sm:w-auto px-4 py-2 rounded-lg font-medium shadow-md bg-yellow-500 hover:bg-yellow-600 text-white text-sm transition-all hover:scale-105"
            >
              📌 Cara Biar Mudah ACC
            </button>

            <button
              onClick={handleAjukan}
              disabled={!setuju}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium shadow-md text-sm transition-all ${
                setuju
                  ? 'bg-red-700 hover:bg-red-800 text-white hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              + Ajukan Dana Baru
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardKaryawan;
