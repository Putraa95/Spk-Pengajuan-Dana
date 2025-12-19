import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function KelolaPinjaman() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Ambil data pinjaman dari backend
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pinjaman");
      console.log("Respon backend:", res.data); // debug
      setList(res.data.data || []); // ✅ ambil array, bukan object
    } catch (err) {
      console.error("❌ Gagal ambil pinjaman:", err.response?.data || err.message);
      alert("Gagal ambil data pinjaman");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Tandai cicilan lunas
  const tandaiLunas = async (id, bulanKe) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/pinjaman/${id}/cicilan/${bulanKe}`
      );
      alert(`✅ Cicilan bulan ke-${bulanKe} ditandai Lunas`);
      fetchData();

      if (selected) {
        setSelected({
          ...selected,
          riwayatCicilan: selected.riwayatCicilan.map((c) =>
            c.bulanKe === bulanKe
              ? { ...c, status: "Lunas", tanggalBayar: new Date() }
              : c
          ),
        });
      }
    } catch (err) {
      console.error("❌ Gagal update cicilan:", err);
      alert("Gagal update cicilan");
    }
  };

  const merahTua = "#C21807";
  const abuTua = "#2E2E2E";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        ⏳ Memuat data pinjaman...
      </div>
    );
  }

  return (
    <div
      className="p-6 min-h-screen"
      style={{ backgroundColor: abuTua, color: "white" }}
    >
      {/* Header + Exit Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">💰 Kelola Pinjaman</h2>
        <button
          onClick={() => navigate("/admin")}
          className="px-4 py-2 rounded-lg shadow-md"
          style={{ backgroundColor: merahTua, color: "white" }}
        >
          ⬅ Keluar ke Dashboard
        </button>
      </div>

      {/* Table Pinjaman */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        {list.length === 0 ? (
          <p className="text-gray-400 p-4">Belum ada data pinjaman.</p>
        ) : (
          <table className="min-w-full text-sm border-collapse">
            <thead style={{ backgroundColor: merahTua }}>
              <tr>
                <th className="p-3 text-left">Nama</th>
                <th className="p-3 text-left">Nominal</th>
                <th className="p-3 text-left">Tenor</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.map((d) => (
                <tr
                  key={d._id}
                  className="hover:bg-gray-700 border-b border-gray-600"
                >
                  <td className="p-3">{d.user?.nama || "-"}</td>
                  <td className="p-3">Rp {d.nominal.toLocaleString("id-ID")}</td>
                  <td className="p-3">{d.tenor} bulan</td>
                  <td className="p-3">
                    {d.status === "Lunas" ? (
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-green-600 text-white">
                        Lunas
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-600 text-white">
                        {d.status}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setSelected(d)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      🔍 Detail Cicilan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Detail Cicilan */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[650px] shadow-lg max-h-[90vh] overflow-y-auto text-black">
            <h3 className="text-lg font-bold mb-3">
              Cicilan: {selected.user?.nama || "-"}
            </h3>
            <p>
              Nominal Pinjaman: Rp {selected.nominal.toLocaleString("id-ID")}
            </p>
            <p>Tenor: {selected.tenor} bulan</p>

            {selected.riwayatCicilan && selected.riwayatCicilan.length > 0 ? (
              <table className="w-full border text-sm mt-3">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2">Bulan</th>
                    <th className="border p-2">Jatuh Tempo</th>
                    <th className="border p-2">Nominal</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.riwayatCicilan.map((c) => (
                    <tr key={c.bulanKe} className="border-b">
                      <td className="p-2 text-center">{c.bulanKe}</td>
                      <td className="p-2">
                        {new Date(c.jatuhTempo).toLocaleDateString("id-ID")}
                      </td>
                      <td className="p-2">
                        Rp {c.nominalPerBulan.toLocaleString("id-ID")}
                      </td>
                      <td className="p-2">
                        {c.status === "Lunas" ? (
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-green-600 text-white">
                            Lunas
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-red-600 text-white">
                            Belum
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {c.status !== "Lunas" ? (
                          <button
                            onClick={() => tandaiLunas(selected._id, c.bulanKe)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Tandai Lunas
                          </button>
                        ) : (
                          <span className="text-gray-400">✔ Sudah</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-red-600 font-semibold mt-2">
                Belum ada cicilan
              </p>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                ❌ Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KelolaPinjaman;
