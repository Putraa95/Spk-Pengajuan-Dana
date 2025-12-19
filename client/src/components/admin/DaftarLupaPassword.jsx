import React, { useEffect, useState } from 'react';
import axios from 'axios';

const warnaAbuTua = '#1E1E1E';

const DaftarLupaPassword = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/lupa-password');
      setRequests(res.data);
    } catch {
      console.error('❌ Gagal mengambil daftar permintaan lupa password');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleKirim = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/lupa-password/reset/${id}`);
      fetchRequests();
    } catch {
      console.error('❌ Gagal mengirim password reset');
    }
  };

  return (
    <div
      className="p-6 min-h-screen"
      style={{ backgroundColor: warnaAbuTua, color: 'white' }}
    >
      <div
        className="rounded-2xl p-6 shadow-lg"
        style={{ backgroundColor: '#2A2A2A' }}
      >
        <h2 className="text-xl font-bold mb-4 text-white">
          🔐 Daftar Permintaan Lupa Password
        </h2>

        {loading ? (
          <p className="text-gray-300 text-center">Sedang memuat...</p>
        ) : (
          <table className="w-full border border-gray-600">
            <thead>
              <tr className="text-gray-300" style={{ backgroundColor: '#333' }}>
                <th className="border border-gray-600 p-2">Nama</th>
                <th className="border border-gray-600 p-2">ID Karyawan</th>
                <th className="border border-gray-600 p-2">Status</th>
                <th className="border border-gray-600 p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((req) => (
                  <tr key={req._id} className="text-center">
                    <td className="border border-gray-600 p-2">{req.nama}</td>
                    <td className="border border-gray-600 p-2">
                      {req.karyawanId}
                    </td>
                    <td className="border border-gray-600 p-2">
                      {req.status === 'Pending' ? (
                        <span className="text-yellow-400 font-semibold">
                          Pending
                        </span>
                      ) : (
                        <span className="text-green-400 font-semibold">
                          Selesai
                        </span>
                      )}
                    </td>
                    <td className="border border-gray-600 p-2">
                      {req.status === 'Pending' ? (
                        <button
                          onClick={() => handleKirim(req._id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                        >
                          Kirim Password
                        </button>
                      ) : (
                        <span className="text-gray-400">✔️ Sudah dikirim</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center border border-gray-600 p-2 text-gray-400 italic"
                  >
                    Tidak ada permintaan lupa password
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DaftarLupaPassword;
