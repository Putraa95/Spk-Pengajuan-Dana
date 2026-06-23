import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/jnt.logo.png";

function RegisterKaryawan() {
  const [idKaryawan, setIdKaryawan] = useState("");
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!/^LS\d{10}$/.test(idKaryawan)) {
      alert("❌ ID harus format LS + 10 angka");
      return;
    }

    if (!jabatan) {
      alert("❌ Pilih jabatan terlebih dahulu");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        idKaryawan: idKaryawan.trim(),
        nama: nama.trim(),
        jabatan,
        password,
      });

      alert(res.data.msg || "Registrasi berhasil!");
      navigate("/login/karyawan");
    } catch (err) {
      alert("❌ Registrasi gagal: " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#8B0000]/70 to-black/50" />

      <form
        onSubmit={handleRegister}
        className="relative bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-gray-800 z-10"
      >
        <h2 className="text-3xl font-bold mb-2 text-center text-[#8B0000]">
          📝 Registrasi Karyawan
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Buat akun untuk mengajukan dana karyawan
        </p>

        {/* ID Karyawan */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">🆔 ID Karyawan</label>

          <input
            type="text"
            value={idKaryawan}
            onChange={(e) => setIdKaryawan(e.target.value)}
            placeholder="LS0000104965"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
          />
        </div>

        {/* Nama */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">👤 Nama Lengkap</label>

          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Masukkan nama lengkap"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
          />
        </div>

        {/* Jabatan */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">💼 Jabatan</label>

          <select
            value={jabatan}
            onChange={(e) => setJabatan(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
          >
            <option value="">-- Pilih Jabatan --</option>

            <option value="Sales Reguler">🚚 Sales Reguler</option>

            <option value="Sales Part Time">⏰ Sales Part Time</option>

            <option value="Sales Pickup">📦 Sales Pickup</option>

            <option value="Warehouse">🏭 Warehouse</option>

            <option value="Transporter">🚛 Transporter</option>
          </select>
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold">🔒 Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#8B0000] hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition"
        >
          Daftar Sekarang
        </button>

        <p className="text-center text-sm text-gray-600 mt-5">
          Sudah punya akun?
          <span
            onClick={() => navigate("/login/karyawan")}
            className="text-[#8B0000] font-semibold cursor-pointer ml-1"
          >
            Login di sini
          </span>
        </p>
      </form>
    </div>
  );
}

export default RegisterKaryawan;
