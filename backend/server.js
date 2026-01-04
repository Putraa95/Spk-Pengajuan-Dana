// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ================== MIDDLEWARE ==================
app.use(
  cors({
    origin: '*', // aman dulu, nanti bisa dikunci ke domain Vercel
  })
);
app.use(express.json());

// ================== ROUTES ==================
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/pengajuan', require('./routes/pengajuan.routes'));
app.use('/api/laporan-bulanan', require('./routes/laporan.routes'));
app.use('/api/admin', require('./routes/adminValidId.routes'));
app.use('/api/lupa-password', require('./routes/lupaPassword.routes'));
app.use('/api/pinjaman', require('./routes/pinjaman.routes'));

// ================== ROOT CHECK ==================
app.get('/', (req, res) => {
  res.send('✅ API SPK Pengajuan Dana aktif');
});

// ================== 404 HANDLER ==================
app.use((req, res) => {
  res.status(404).json({ message: '❌ Endpoint tidak ditemukan' });
});

// ================== ERROR HANDLER ==================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: '❌ Internal Server Error' });
});

// ================== DATABASE ==================
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI belum diset di environment!');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
