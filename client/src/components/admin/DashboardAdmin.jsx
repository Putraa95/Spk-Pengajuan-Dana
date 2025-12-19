import React from "react";
import { Home, FileText, ClipboardList, LogOut, KeyIcon } from "lucide-react";
import { Link } from "react-router-dom";
import LogoJNT from "../../assets/LogoJNT.png";

function DashboardAdminClean() {
  const merahJnt = "#C21807";
 

  const menuItems = [
    { to: "/admin", icon: <Home size={36} />, label: "Dashboard" },
    {
      to: "/admin/daftar-pengajuan",
      icon: <FileText size={36} />,
      label: "Daftar Pengajuan",
    },
    {
      to: "/admin/riwayat",
      icon: <FileText size={36} />,
      label: "Riwayat Pengajuan",
    },
    {
      to: "/admin/valid-id",
      icon: <ClipboardList size={36} />,
      label: "Admin Valid ID",
    },
    {
      to: "/admin/kelola-pinjaman",
      icon: <ClipboardList size={36} />,
      label: "Kelola Pinjaman",
    },
    {
      to: "/admin/laporan-bulanan",
      icon: <FileText size={36} />,
      label: "Laporan Bulanan",
    },
    {
      to: "/admin/lupa-password",
      icon: <KeyIcon size={36} />,
      label: "Daftar Lupa Password",
    },
    { to: "/", icon: <LogOut size={36} />, label: "Logout" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* ===== HEADER ===== */}
      <header className="w-full flex justify-between items-center px-8 py-4 bg-gray-900/90 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-white">Dashboard Admin</h1>
        <img src={LogoJNT} alt="Logo JNT" className="h-10" />
      </header>

      {/* ===== MENU GRID ===== */}
      <main className="flex-1 w-full flex items-start justify-center mt-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-6xl p-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg bg-white/10 backdrop-blur-md hover:scale-105 hover:shadow-xl transition-transform duration-300"
            >
              <div
                className="mb-3 p-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: merahJnt, color: "white" }}
              >
                {item.icon}
              </div>
              <span className="text-lg font-semibold text-gray-100 text-center">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="text-xs text-gray-400 text-center py-4">
        © {new Date().getFullYear()} PT Semut Merah Squad <br />
        Cabang PT Burangrang Cahaya Gemilang
      </footer>
    </div>
  );
}

export default DashboardAdminClean;
