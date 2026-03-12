import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../loginAdmin.css';

function LoginAdmin() {
  const [idKaryawan, setIdKaryawan] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`http://localhost:5000/api/auth/login`, {
        idKaryawan,
        password,
      });

      const { user, token, message } = res.data;

      if (!user) return alert('❌ User tidak ditemukan');
      if (user.role !== 'admin') return alert('❌ Akun ini bukan admin');

      localStorage.setItem('user', JSON.stringify({ ...user, token }));

      alert(message || '✅ Login admin berhasil');
      navigate('/admin');
    } catch (err) {
      alert('❌ Login gagal: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login Admin</h2>
        <p className="login-subtitle">Sistem Pengajuan Dana Karyawan</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>ID Admin</label>
            <input
              type="text"
              value={idKaryawan}
              onChange={(e) => setIdKaryawan(e.target.value)}
              placeholder="Masukkan ID Admin"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan Password"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginAdmin;
