import React from 'react';
import { useNavigate } from 'react-router-dom';

function CaraBiarACC() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-start p-6">
      {/* HEADER */}
      <header className="w-full max-w-3xl bg-red-600 text-white p-6 rounded-2xl shadow-lg mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">❗ Tips Biar Pengajuan Mudah ACC</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Kembali
        </button>
      </header>

      {/* KONTEN UTAMA */}
      <main className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-lg space-y-4 text-gray-800 leading-relaxed">
        <p className="text-gray-700">
          Sistem penilaian kami pakai{' '}
          <span className="font-semibold text-red-600">
            metode Weighted Product (WP)
          </span>
          , jadi keputusan ACC murni dari hasil hitung otomatis berdasarkan
          beberapa faktor. Nah biar peluang disetujui lebih besar, perhatikan
          beberapa hal penting ini:
        </p>

        <ul className="list-disc list-inside space-y-3 text-gray-800">
          <li>
            💰 <span className="font-semibold">Gaji & masa kerja</span> jadi
            faktor paling berpengaruh. Semakin stabil dan lama kamu kerja, makin
            tinggi peluang ACC.
          </li>
          <li>
            📄 Ajukan{' '}
            <span className="font-semibold">nominal pinjaman yang wajar</span>,
            jangan terlalu besar dibanding gaji.
          </li>
          <li>
            📆 Untuk yang{' '}
            <span className="font-semibold text-red-600">
              belum genap 1 tahun kerja
            </span>
            , disarankan{' '}
            <span className="font-semibold">jangan dulu mengajukan</span>.
            Prioritas tetap diberikan ke karyawan yang sudah cukup lama bekerja.
          </li>
          <li>
            ⚠️ Jangan pernah{' '}
            <span className="font-semibold text-red-600">
              memasukkan data palsu
            </span>
            . Admin punya data asli, dan kalau ketahuan manipulasi — pengajuan
            langsung
            <span className="font-semibold text-red-600">
              {' '}
              ditolak otomatis
            </span>
            .
          </li>
          <li>
            ⏳ Kalau kamu merasa sudah layak tapi masih ditolak, bisa jadi{' '}
            <span className="font-semibold">
              kuota dana lagi penuh atau limit pinjaman sementara habis
            </span>
            . Tenang aja, kamu bisa ajukan lagi di periode berikutnya.
          </li>
        </ul>

        <p className="italic text-gray-600 mt-4">
          *Catatan: Semua hasil penilaian berdasarkan sistem otomatis WP. Admin
          hanya memverifikasi, bukan menentukan hasil akhir.
        </p>

        <div className="bg-red-100 border-l-4 border-red-600 p-4 rounded-lg text-sm text-gray-800">
          💡 <span className="font-semibold">Intinya:</span> Jujur isi datanya,
          sabar kalau belum ACC, dan pastikan kondisi keuangan kamu stabil.
          Sistem menilai secara adil kok. 🙂
        </div>
      </main>
    </div>
  );
}

export default CaraBiarACC;
