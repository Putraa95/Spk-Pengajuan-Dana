import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/jnt.logo.png"; 

function RegisterKaryawan() {
  const [idKaryawan, setIdKaryawan] = useState("");
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!/^LS\d{10}$/.test(idKaryawan)) {
      alert("❌ ID harus format LS + 10 angka (contoh: LS0000104965)");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        idKaryawan: idKaryawan.trim(),
        nama: nama.trim(),
        password,
      });

      alert(res.data.message || "Registrasi berhasil!");
      navigate("/login/karyawan");
    } catch (err) {
      alert(
        "❌ Registrasi gagal: " + (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${bgImage})`, // ✅ gunakan gambar
      }}
    >
      {/* Overlay gradasi merah transparan, biar nuansa JNT tapi gak buram */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8B0000]/70 to-black/50" />

      {/* Form */}
      <form
        onSubmit={handleRegister}
        className="relative bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-gray-800 z-10"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-[#8B0000]">
          Registrasi Karyawan
        </h2>

        {/* ID Karyawan */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold text-gray-700">
            ID Karyawan
          </label>
          <input
            type="text"
            value={idKaryawan}
            onChange={(e) => setIdKaryawan(e.target.value)}
            placeholder="Contoh: LS0000104965"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition"
          />
        </div>

        {/* Nama */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold text-gray-700">Nama</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nama Lengkap"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition"
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition"
          />
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          className="w-full bg-[#8B0000] hover:bg-red-500 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-xl"
        >
          Daftar
        </button>
      </form>
    </div>
  );
}

export default RegisterKaryawan;
