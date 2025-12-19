import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/jnt.logo.png"; // ✅ pakai gambar dari assets

function LoginKaryawan() {
  const [idKaryawan, setIdKaryawan] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        idKaryawan: idKaryawan.trim(),
        password: password.trim(),
      });

      if (!res.data.success) {
        alert("❌ Login gagal: " + (res.data.message || "Unknown error"));
        return;
      }

      if (res.data.user?.role !== "karyawan") {
        alert("❌ Akun ini bukan karyawan!");
        return;
      }

      const userData = {
        _id: res.data.user._id,
        idKaryawan: res.data.user.idKaryawan,
        nama: res.data.user.nama,
        role: res.data.user.role,
      };
      localStorage.setItem("user", JSON.stringify(userData));

      alert(res.data.message || "Login berhasil!");
      navigate("/karyawan");
    } catch (err) {
      console.error("Login error:", err);
      alert("❌ Login gagal: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${bgImage})`, // ✅ gunakan background dari assets
      }}
    >
      {/* Overlay merah khas J&T */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8B0000]/75 to-black/60" />

      <form
        onSubmit={handleLogin}
        className="relative bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-gray-800 z-10"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-[#8B0000]">
          🚚 Login Karyawan
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

        {/* Password */}
        <div className="mb-6">
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

        {/* Tombol Login */}
        <button
          type="submit"
          className="w-full bg-[#8B0000] hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-xl"
        >
          Login
        </button>

        {/* Reset Password */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Lupa password?{" "}
          <span
            onClick={() => navigate("/reset-password")}
            className="text-[#8B0000] hover:text-red-700 cursor-pointer font-semibold"
          >
            Reset di sini
          </span>
        </p>

        {/* Link ke Register */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Belum punya akun?{" "}
          <span
            className="text-[#8B0000] hover:text-red-700 cursor-pointer font-semibold"
            onClick={() => navigate("/register")}
          >
            Daftar di sini
          </span>
        </p>
      </form>
    </div>
  );
}

export default LoginKaryawan;
