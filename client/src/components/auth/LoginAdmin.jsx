import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginAdmin() {
  const [idKaryawan, setIdKaryawan] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          idKaryawan,
          password,
        }
      );

      const userData = res.data.user;
      const token = res.data.token;

      if (!userData) {
        alert('❌ Login gagal: user tidak ditemukan');
        return;
      }

      if (userData.role !== 'admin') {
        alert('❌ Akun ini bukan admin!');
        return;
      }

      localStorage.setItem('user', JSON.stringify({ ...userData, token }));

      alert(res.data.message || '✅ Login admin berhasil!');
      navigate('/admin');
    } catch (err) {
      alert('❌ Login gagal: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-200 to-red-400">
      <form
        onSubmit={handleLogin}
        className="bg-white/95 backdrop-blur-md p-10 rounded-2xl shadow-lg w-full max-w-md text-gray-800"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
          🔑 Login Admin
        </h2>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-gray-700">
            ID Admin
          </label>
          <input
            type="text"
            value={idKaryawan}
            onChange={(e) => setIdKaryawan(e.target.value)}
            placeholder="Contoh: Admin123"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          />
        </div>

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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginAdmin;
