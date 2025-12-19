import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RiwayatPengajuanKaryawan() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/pengajuan/user/${user._id}`
        );
        if (res.data.success) {
          setList(res.data.data); // ✅ ambil array pengajuan
        } else {
          setList([]);
        }
      } catch (err) {
        console.error("❌ Gagal fetch riwayat pengajuan:", err.response?.data || err.message);
        setList([]);
      }
    };
    fetch();
  }, []);

  const merahTua = "#C21807";
  const abuTua = "#2E2E2E";

  const renderStatus = (status) => {
    if (status === "Disetujui") {
      return (
        <span className="px-2 py-1 rounded text-xs font-semibold bg-green-600 text-white">
          Disetujui
        </span>
      );
    } else if (status === "Ditolak") {
      return (
        <span className="px-2 py-1 rounded text-xs font-semibold bg-red-600 text-white">
          Ditolak
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-500 text-black">
          Pending
        </span>
      );
    }
  };

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: abuTua, color: "white" }}>
      {/* Header + Tombol Exit */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🗂 Riwayat Pengajuan Saya</h2>
        <button
          onClick={() => navigate("/admin")}
          className="px-4 py-2 rounded-lg shadow-md"
          style={{ backgroundColor: merahTua, color: "white" }}
        >
          ⬅ Keluar ke Dashboard
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full text-sm border-collapse">
          <thead style={{ backgroundColor: merahTua }}>
            <tr>
              <th className="p-3 text-left">Nominal</th>
              <th className="p-3 text-left">Tanggal</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Mulai Cicil</th>
              <th className="p-3 text-left">Tenor</th>
            </tr>
          </thead>
          <tbody>
            {list.length > 0 ? (
              list.map((row) => (
                <tr key={row._id} className="hover:bg-gray-700 border-b border-gray-600">
                  <td className="p-3">Rp {row.nominal.toLocaleString("id-ID")}</td>
                  <td className="p-3">{new Date(row.tanggalPengajuan).toLocaleDateString("id-ID")}</td>
                  <td className="p-3">{renderStatus(row.status)}</td>
                  <td className="p-3">
                    {row.tanggalCair
                      ? new Date(row.tanggalCair).toLocaleDateString("id-ID")
                      : "-"}
                  </td>
                  <td className="p-3">{row.tenor || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  Belum ada riwayat pengajuan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RiwayatPengajuanKaryawan;
