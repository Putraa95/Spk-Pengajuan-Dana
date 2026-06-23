import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/jnt.logo.png";

function LoginAdmin() {
  const [idKaryawan, setIdKaryawan] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

      if (res.data.user?.role !== "admin") {
        alert("❌ Akun ini bukan admin!");
        return;
      }

      const userData = {
        _id: res.data.user._id,
        idKaryawan: res.data.user.idKaryawan,
        nama: res.data.user.nama,
        role: res.data.user.role,
      };

      localStorage.setItem("user", JSON.stringify(userData));

      alert(res.data.message || "Login admin berhasil!");
      navigate("/admin");
    } catch (err) {
      console.error("Login error:", err);
      alert("❌ Login gagal: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8B0000]/75 to-black/60" />

      <form
        onSubmit={handleLogin}
        className="relative bg-white/95 backdrop-blur-sm p-10 rounded-3xl shadow-2xl w-full max-w-md text-gray-800 z-10"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔐</div>

          <h2 className="text-3xl font-bold text-gray-800">
            Administrator Login
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Akses khusus pengelola sistem pengajuan dana karyawan
          </p>
        </div>

        {/* ID Admin */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold text-gray-700">
            ID Administrator
          </label>

          <input
            type="text"
            value={idKaryawan}
            onChange={(e) => setIdKaryawan(e.target.value)}
            placeholder="Masukkan ID Administrator"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold text-gray-700">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan Password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 text-gray-500"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="bg-gray-100 rounded-xl p-3 mb-5">
          <p className="text-xs text-gray-600 text-center">
            Sistem ini hanya dapat diakses oleh administrator yang memiliki hak
            pengelolaan data karyawan dan pengajuan dana.
          </p>
        </div>

        {/* Login */}
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md"
        >
          Masuk ke Dashboard
        </button>

        {/* Kembali */}
        <p className="text-center text-sm text-gray-600 mt-5">
          Login sebagai karyawan?
          <span
            onClick={() => navigate("/login")}
            className="text-red-600 font-semibold cursor-pointer ml-1"
          >
            Klik di sini
          </span>
        </p>
      </form>
    </div>
  );
}

export default LoginAdmin;
