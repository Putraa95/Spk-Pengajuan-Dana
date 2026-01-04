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
        { idKaryawan, password }
      );

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
    <form onSubmit={handleLogin}>
      <input
        value={idKaryawan}
        onChange={(e) => setIdKaryawan(e.target.value)}
        placeholder="ID Admin"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginAdmin;
