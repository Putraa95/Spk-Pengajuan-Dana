import React from "react";
import { useNavigate } from "react-router-dom";
import jntImg from "../../assets/jnt.png";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${jntImg})`,
      }}
    >
      {/* Overlay gelap supaya background tidak terlalu terang */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Kotak konten diperbesar */}
      <div className="relative z-10 bg-white/95 p-12 rounded-2xl shadow-2xl w-3/4 max-w-md text-center text-gray-800">
        <h1 className="text-3xl font-bold mb-6">
          Sistem Pengajuan Dana Karyawan
        </h1>
        <p className="mb-8 text-gray-700 text-base">
          Silakan pilih login sesuai peran Anda untuk mengelola atau mengajukan
          dana.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/login/admin")}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition"
          >
            🔑 Login Admin
          </button>

          <button
            onClick={() => navigate("/login/karyawan")}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition"
          >
            🚚 Login Karyawan
          </button>

          <button
            onClick={() => navigate("/register")}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-lg font-medium transition"
          >
            📝 Buat Akun Baru
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
