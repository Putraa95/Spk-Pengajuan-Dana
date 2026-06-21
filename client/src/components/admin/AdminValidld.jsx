import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminValidId = () => {
  const [list, setList] = useState([]);

  const [newId, setNewId] = useState("");
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [email, setEmail] = useState("");

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
      });

      setNewId("");
      setNama("");
      setJabatan("");
      setEmail("");

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
      className="min-h-screen p-6"
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
      <div className="bg-white rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="ID Karyawan"
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            className="px-3 py-2 border rounded"
            style={{ color: "black" }}
          />

          <input
            type="text"
            placeholder="Nama Karyawan"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="px-3 py-2 border rounded"
            style={{ color: "black" }}
          />

          <input
            type="text"
            placeholder="Jabatan"
            value={jabatan}
            onChange={(e) => setJabatan(e.target.value)}
            className="px-3 py-2 border rounded"
            style={{ color: "black" }}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-2 border rounded"
            style={{ color: "black" }}
          />
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
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse">
          <thead
            style={{
              backgroundColor: merahTua,
            }}
          >
            <tr>
              <th className="p-3 border">ID Karyawan</th>
              <th className="p-3 border">Nama</th>
              <th className="p-3 border">Jabatan</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {belumDipakai.length > 0 ? (
              belumDipakai.map((item) => (
                <tr key={item._id} className="hover:bg-gray-700">
                  <td className="p-2 border">{item.idKaryawan}</td>

                  <td className="p-2 border">{item.nama}</td>

                  <td className="p-2 border">{item.jabatan}</td>

                  <td className="p-2 border">{item.email}</td>

                  <td className="p-2 border text-red-400 font-bold">
                    {item.status}
                  </td>

                  <td className="p-2 border">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-1 rounded"
                      style={{
                        backgroundColor: "#f44336",
                        color: "white",
                      }}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Sudah Digunakan */}
      <h3 className="text-lg font-semibold mb-2">Sudah Digunakan</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead
            style={{
              backgroundColor: merahTua,
            }}
          >
            <tr>
              <th className="p-3 border">ID Karyawan</th>
              <th className="p-3 border">Nama</th>
              <th className="p-3 border">Jabatan</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {sudahRegistrasi.length > 0 ? (
              sudahRegistrasi.map((item) => (
                <tr key={item._id} className="hover:bg-gray-700">
                  <td className="p-2 border">{item.idKaryawan}</td>

                  <td className="p-2 border">{item.nama}</td>

                  <td className="p-2 border">{item.jabatan}</td>

                  <td className="p-2 border">{item.email}</td>

                  <td className="p-2 border text-green-400 font-bold">
                    {item.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4">
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
