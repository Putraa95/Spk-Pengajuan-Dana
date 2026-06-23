import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminValidId = () => {
  const [list, setList] = useState([]);

  const [newId, setNewId] = useState("");
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");

  const navigate = useNavigate();

  const merahTua = "#C21807";
  const abuTua = "#374151";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/valid-ids");

      setList(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setList([]);
    }
  };

  const handleAdd = async () => {
    if (!newId || !nama || !jabatan) {
      return alert("ID Karyawan, Nama dan Jabatan wajib diisi!");
    }

    try {
      await axios.post("http://localhost:5000/api/admin/valid-ids", {
        idKaryawan: newId,
        nama,
        jabatan,
        email,
        noHp,
      });

      setNewId("");
      setNama("");
      setJabatan("");
      setEmail("");
      setNoHp("");

      fetchData();
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Gagal menambahkan ID");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus data ini?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/valid-ids/${id}`);

      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data");
    }
  };

  const belumDipakai = list.filter((item) => item.status === "Belum Digunakan");

  const sudahRegistrasi = list.filter(
    (item) => item.status === "Sudah Digunakan",
  );

  return (
    <div
      className="min-h-screen px-4 md:px-8 py-6"
      style={{
        backgroundColor: abuTua,
        color: "white",
      }}
    >
      {/* Header */}{" "}
      <div className="flex justify-between items-center mb-6">
        {" "}
        <h2 className="text-2xl font-bold">Admin Valid ID </h2>
        <button
          onClick={() => navigate("/admin")}
          className="px-4 py-2 rounded-lg shadow-md"
          style={{
            backgroundColor: merahTua,
            color: "white",
          }}
        >
          Dashboard
        </button>
      </div>
      {/* Form Tambah */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-red-400 text-center mb-6">
          {" "}
          ➕ Tambah Data Karyawan{" "}
        </h3>
        <div className="space-y-4">
          {" "}
          <input
            type="text"
            placeholder="🆔 ID Karyawan (LSxxxxxxxxxx)"
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            className="w-full max-w-md bg-gray-700 rounded-xl p-5 mb-4 shadow-lg border "
          />{" "}
          <input
            type="text"
            placeholder="👤 Nama Karyawan"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full max-w-md bg-gray-700 rounded-xl p-5 mb-6 shadow-lg border "
          />{" "}
          <select
            value={jabatan}
            onChange={(e) => setJabatan(e.target.value)}
            className="w-full max-w-md bg-gray-700 rounded-xl p-5 mb-6 shadow-lg border "
          >
            {" "}
            <option value="">💼 Pilih Jabatan</option>{" "}
            <option value="Sales Reguler"> 🚚 Sales Reguler </option>{" "}
            <option value="Sales Part Time"> ⏰ Sales Part Time </option>{" "}
            <option value="Sales Pickup"> 📦 Sales Pickup </option>{" "}
            <option value="Warehouse"> 🏭 Warehouse </option>{" "}
            <option value="Transporter"> 🚛 Transporter </option>{" "}
          </select>{" "}
          <input
            type="email"
            placeholder="📧 Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full max-w-md bg-gray-700 rounded-xl p-5 mb-6 shadow-lg border "
          />{" "}
          <input
            type="text"
            placeholder="📱 Nomor Telepon"
            value={noHp}
            onChange={(e) => setNoHp(e.target.value)}
            className="w-full max-w-md bg-gray-700 rounded-xl p-5 mb-6 shadow-lg border "
          />{" "}
        </div>

        <button
          onClick={handleAdd}
          className="mt-4 px-4 py-2 rounded"
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
          }}
        >
          Tambah Valid ID
        </button>
      </div>
      {/* Belum Digunakan */}
      <h3 className="text-lg font-semibold mb-2">Belum Digunakan</h3>
      <h3 className="text-lg font-semibold mb-3">
        📝 Data Karyawan Belum Digunakan
      </h3>
      {!belumDipakai.length ? (
        <div className="bg-gray-700 border border-gray-600 rounded-xl p-8 text-center mb-8">
          <div className="text-5xl mb-3">📭</div>

          <h4 className="text-lg font-semibold text-white mb-2">
            Tidak Ada Data
          </h4>
          <p className="text-gray-400">
            Semua data karyawan sudah digunakan untuk registrasi.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {belumDipakai.map((item) => (
            <div
              key={item._id}
              className="bg-gray-700 border border-red-500 rounded-xl p-5 shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-red-400">🆔 {item.idKaryawan}</h4>

                <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                  {item.status}
                </span>
              </div>

              <div className="space-y-2 text-white mb-4">
                <p>👤 {item.nama}</p>
                <p>💼 {item.jabatan}</p>
                <p>📧 {item.email}</p>
                <p>📱 {item.noHp || "-"}</p>
              </div>

              <button
                onClick={() => handleDelete(item._id)}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
              >
                🗑️ Hapus Data
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Sudah Digunakan */}
      <h3 className="text-lg font-semibold mb-2">Sudah Digunakan</h3>
      {!sudahRegistrasi.length ? (
        <div className="bg-gray-700 border border-gray-600 rounded-xl p-8 text-center">
          <div className="text-5xl mb-3">📭</div>

          <h4 className="text-lg font-semibold text-white mb-2">
            Belum Ada Data
          </h4>

          <p className="text-gray-400">
            Belum ada karyawan yang melakukan registrasi.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sudahRegistrasi.map((item) => (
            <div
              key={item._id}
              className="bg-gray-700 border border-green-500 rounded-xl p-5 shadow-lg"
            >
              <div className="flex justify-between mb-4">
                <h4 className="font-bold text-red-400">🆔 {item.idKaryawan}</h4>

                <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                  {item.status}
                </span>
              </div>

              <div className="space-y-2 text-white">
                <p>👤 {item.nama}</p>
                <p>💼 {item.jabatan}</p>
                <p>📧 {item.email}</p>
                <p>📱 {item.noHp || "-"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminValidId;
