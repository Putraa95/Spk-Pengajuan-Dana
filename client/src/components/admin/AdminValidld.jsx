import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminValidId = () => {
  const [list, setList] = useState([]);
  const [newId, setNewId] = useState("");
  const navigate = useNavigate();

  const merahTua = "#C21807";
  const abuTua = "#2E2E2E";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/valid-ids");
      setList(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setList([]);
    }
  };

  const handleAdd = async () => {
    if (!newId) return alert("Masukkan ID Karyawan!");
    try {
      await axios.post("http://localhost:5000/api/admin/valid-ids", {
        idKaryawan: newId,
      });
      setNewId("");
      fetchData();
    } catch (err) {
      console.error("❌ Add error:", err);
      alert("Gagal menambahkan ID");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus ID ini?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/valid-ids/${id}`);
      fetchData();
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("Gagal menghapus ID");
    }
  };

  const belumDipakai = list.filter((item) => !item.assigned);
  const sudahRegistrasi = list.filter((item) => item.assigned);

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: abuTua, color: "white" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🛠️ Admin Valid ID</h2>
        <button
          onClick={() => navigate("/admin")}
          className="px-4 py-2 rounded-lg shadow-md"
          style={{ backgroundColor: merahTua, color: "white" }}
        >
          ⬅ Keluar ke Dashboard
        </button>
      </div>

      {/* Form Tambah ID */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Masukkan ID Karyawan (LSXXXXXXXXXX)"
          value={newId}
          onChange={(e) => setNewId(e.target.value)}
          className="flex-1 px-3 py-2 rounded border"
          style={{ color: "black" }}
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 rounded"
          style={{ backgroundColor: "#4CAF50", color: "white" }}
        >
          Tambah
        </button>
      </div>

      {/* Table Belum Dipakai */}
      <h3 className="text-lg font-semibold mb-2">
        📝 ID Tambahan (Belum Registrasi)
      </h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse">
          <thead style={{ backgroundColor: merahTua }}>
            <tr>
              <th className="p-3 border">ID Karyawan</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {belumDipakai.length > 0 ? (
              belumDipakai.map((item) => (
                <tr key={item._id} className="hover:bg-gray-700">
                  <td className="p-2 border">{item.idKaryawan}</td>
                  <td className="p-2 border font-bold text-red-400">
                    ❌ Belum dipakai
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-1 rounded"
                      style={{ backgroundColor: "#f44336", color: "white" }}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-3 text-center text-gray-400">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Sudah Registrasi */}
      <h3 className="text-lg font-semibold mb-2">✅ Sudah Registrasi</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead style={{ backgroundColor: merahTua }}>
            <tr>
              <th className="p-3 border">Nama</th>
              <th className="p-3 border">ID Karyawan</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sudahRegistrasi.length > 0 ? (
              sudahRegistrasi.map((item) => (
                <tr key={item._id} className="hover:bg-gray-700">
                  <td className="p-2 border">
                    {item.assignedTo ? item.assignedTo.nama : "-"}
                  </td>
                  <td className="p-2 border">{item.idKaryawan}</td>
                  <td className="p-2 border font-bold text-green-400">
                    ✅ Dipakai
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-1 rounded"
                      style={{ backgroundColor: "#f44336", color: "white" }}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-400">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminValidId;
