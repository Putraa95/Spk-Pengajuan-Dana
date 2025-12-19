function getFirstJatuhTempo(fromDate) {
  const d = new Date(fromDate);
  // mulai pada tanggal 4 bulan berikutnya
  const r = new Date(d.getFullYear(), d.getMonth() + 1, 4);
  return r;
}

function generateSchedule(mulai, tenor, nominalPerBulan) {
  const arr = [];
  for (let i = 0; i < tenor; i++) {
    const jatuh = new Date(mulai.getFullYear(), mulai.getMonth() + i, 4);
    arr.push({
      bulanKe: i + 1,
      jatuhTempo: jatuh,
      nominalPerBulan,
      status: "Belum Bayar",
    });
  }
  return arr;
}

module.exports = { getFirstJatuhTempo, generateSchedule };
