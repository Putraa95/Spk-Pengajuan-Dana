// ================================================
// ✅ Fungsi: hitungWP() — Disesuaikan untuk J&T

// ================================================
function hitungWP({ gaji, lamaKerja, tanggungan, nominal, tenor }) {
  // 1️⃣ SKOR 1–5 SESUAI KONDISI NYATA DI J&T
  const skorGaji =
    gaji >= 7000000 ? 5 :
    gaji >= 5000000 ? 4 :
    gaji >= 3500000 ? 3 :
    gaji >= 2500000 ? 2 : 1;

  const skorLamaKerja =
    lamaKerja >= 60 ? 5 :
    lamaKerja >= 36 ? 4 :
    lamaKerja >= 24 ? 3 :
    lamaKerja >= 12 ? 2 : 1;

  const skorTanggungan =
    tanggungan === 0 ? 5 :
    tanggungan === 1 ? 4 :
    tanggungan === 2 ? 3 :
    tanggungan === 3 ? 2 : 1;

  const skorNominal =
    nominal <= 2000000 ? 5 :
    nominal <= 4000000 ? 4 :
    nominal <= 6000000 ? 3 :
    nominal <= 8000000 ? 2 : 1;

  const skorTenor =
    tenor <= 6 ? 5 :
    tenor <= 12 ? 4 :
    tenor <= 18 ? 3 :
    tenor <= 24 ? 2 : 1;

  // 2️⃣ BOBOT — DITEKAN DI Gaji & LamaKerja
  const bobot = {
    gaji: 0.35,
    lamaKerja: 0.25,
    tanggungan: 0.15,
    nominal: 0.15,
    tenor: 0.10,
  };

  // 3️⃣ NORMALISASI
  const nGaji = skorGaji / 5;
  const nLamaKerja = skorLamaKerja / 5;
  const nTanggungan = skorTanggungan / 5;
  const nNominal = skorNominal / 5;
  const nTenor = skorTenor / 5;

  // 4️⃣ HITUNG NILAI WP
  const hasil =
    Math.pow(nGaji, bobot.gaji) *
    Math.pow(nLamaKerja, bobot.lamaKerja) *
    Math.pow(nTanggungan, bobot.tanggungan) *
    Math.pow(nNominal, bobot.nominal) *
    Math.pow(nTenor, bobot.tenor);

  // 5️⃣ PENYESUAIAN SKALA (biar rata-rata ~1.5)
  const hasilSkala = hasil * 3.2;

  // 6️⃣ PENENTUAN STATUS — lebih longgar & realistis
  let statusWP = "";
  if (hasilSkala >= 2.5) statusWP = "Sangat Layak";
  else if (hasilSkala >= 1.5) statusWP = "Layak";
  else if (hasilSkala >= 1.0) statusWP = "Pertimbangkan";
  else statusWP = "Tidak Layak";

  // 7️⃣ RETURN — langsung masuk MongoDB
  return {
    skor: { skorGaji, skorLamaKerja, skorTanggungan, skorNominal, skorTenor },
    normalisasi: { nGaji, nLamaKerja, nTanggungan, nNominal, nTenor },
    bobot,
    hasil: Number(hasilSkala.toFixed(3)),
    nilai: hasilSkala,
    statusWP,
  };
}

module.exports = { hitungWP };
