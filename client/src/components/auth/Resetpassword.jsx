import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const [idKaryawan, setIdKaryawan] = useState("");
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          idKaryawan,
          passwordLama,
          passwordBaru,
        }
      );

      alert("✅ " + res.data.msg);
      navigate("/");
    } catch (err) {
      alert("❌ " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200">
      <form
        onSubmit={handleReset}
        className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md text-gray-800"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
          🔒 Reset Password
        </h2>

        {/* ID Karyawan */}
        <input
          type="text"
          placeholder="ID Karyawan"
          value={idKaryawan}
          onChange={(e) => setIdKaryawan(e.target.value)}
          required
          className="w-full mb-4 px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        />

        {/* Password Lama */}
        <input
          type="password"
          placeholder="Password lama"
          value={passwordLama}
          onChange={(e) => setPasswordLama(e.target.value)}
          required
          className="w-full mb-4 px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        />

        {/* Password Baru */}
        <input
          type="password"
          placeholder="Password baru"
          value={passwordBaru}
          onChange={(e) => setPasswordBaru(e.target.value)}
          required
          className="w-full mb-6 px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all hover:shadow-lg"
        >
          Ganti Password
        </button>

        {/* Link ke admin */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Lupa password lama..?{" "}
          <span
            className="text-red-600 hover:text-red-700 cursor-pointer font-semibold"
            onClick={() => navigate("/lupa-password")}
          >
            Ajukan ke admin
          </span>
        </p>
      </form>
    </div>
  );
}

export default ResetPassword;
