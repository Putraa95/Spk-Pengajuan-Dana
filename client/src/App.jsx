// client/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🔑 Auth Pages
import LandingPage from "./components/auth/LandingPage";
import LoginAdmin from "./components/auth/LoginAdmin";
import LoginKaryawan from "./components/auth/LoginKaryawan";
import Register from "./components/auth/Register";
import ResetPassword from "./components/auth/Resetpassword";

// 👨‍💼 Admin Pages
import DashboardAdmin from "./components/admin/DashboardAdmin";
import KelolaPinjaman from "./components/admin/KelolaPinjaman";

import LaporanBulanan from "./components/admin/LaporanBulanan";
import RiwayatPengajuan from "./components/admin/RiwayatPengajuan";
import DaftarPengajuan from "./components/admin/DaftarPengajuan";
import AdminValidId from "./components/admin/AdminValidld";
import DaftarLupaPassword from "./components/admin/DaftarLupaPassword";

// 👷 Karyawan Pages
import DashboardKaryawan from "./components/karyawan/DashboardKaryawan";
import FormPengajuan from "./components/karyawan/FormPengajuan";
import LupaPassword from "./components/karyawan/LupaPassword";
import CaraBiarACC from "./components/karyawan/CaraBiarAcc";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🏠 Landing & Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/login/karyawan" element={<LoginKaryawan />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 👨‍💼 Admin Routes */}
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/admin/kelola-pinjaman" element={<KelolaPinjaman />} />

        <Route path="/admin/laporan-bulanan" element={<LaporanBulanan />} />
        <Route path="/admin/riwayat" element={<RiwayatPengajuan />} />
        <Route path="/admin/daftar-pengajuan" element={<DaftarPengajuan />} />
        <Route path="/admin/valid-id" element={<AdminValidId />} />
        <Route path="/admin/lupa-password" element={<DaftarLupaPassword />} />

        {/* 👷 Karyawan Routes */}
        <Route path="/karyawan" element={<DashboardKaryawan />} />
        <Route path="/pengajuan" element={<FormPengajuan />} />
        <Route path="/lupa-password" element={<LupaPassword />} />
        <Route path="/cara-agar-acc" element={<CaraBiarACC />} />
      </Routes>
    </Router>
  );
}

export default App;
