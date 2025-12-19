import React, { useState } from "react";
import axios from "axios";

const LupaPassword = () => {
  const [nama, setNama] = useState("");
  const [karyawanId, setKaryawanId] = useState("");
  const [status, setStatus] = useState(null);
  const [passwordLama, setPasswordLama] = useState(null);

  const handleAjukan = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/lupa-password/ajukan",
        {
          nama,
          karyawanId,
        }
      );
      setStatus(res.data.msg);
      setPasswordLama(null);
    } catch (err) {
      setStatus(err.response?.data?.msg || "Gagal ajukan lupa password");
    }
  };

  const handleCekStatus = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/lupa-password/status/${karyawanId}`
      );

      if (res.data.passwordLama) {
        setPasswordLama(res.data.passwordLama);
      }
      setStatus(res.data.msg);
    } catch (err) {
      setStatus(err.response?.data?.msg || "Gagal cek status");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200 p-4">
      <div className="bg-white/95 backdrop-blur-md shadow-xl rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-center text-red-600 mb-4">
          Lupa Password
        </h2>

        <input
          type="text"
          placeholder="Nama Lengkap"
          className="w-full border border-red-300 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />

        <input
          type="text"
          placeholder="ID Karyawan"
          className="w-full border border-red-300 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          value={karyawanId}
          onChange={(e) => setKaryawanId(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            onClick={handleAjukan}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-shadow shadow-md hover:shadow-lg"
          >
            Ajukan
          </button>
          <button
            onClick={handleCekStatus}
            className="flex-1 bg-red-300 text-white py-2 rounded-lg hover:bg-red-400 transition-shadow shadow-md hover:shadow-lg"
          >
            Cek Status
          </button>
        </div>

        {status && (
          <p className="mt-4 text-center text-gray-700 font-medium">{status}</p>
        )}

        {passwordLama && (
          <div className="mt-4 p-3 border rounded-lg bg-green-50 text-center">
            <p className="font-semibold text-green-700">
              Password Lama Anda: {passwordLama}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LupaPassword;
