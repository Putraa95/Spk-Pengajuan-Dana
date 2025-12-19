// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ================== MIDDLEWARE ==================
app.use(cors());
app.use(express.json());

// ================== IMPORT ROUTES ==================
const authRoutes = require('./routes/auth.routes'); // login, register, reset, lupa password
const pengajuanRoutes = require('./routes/pengajuan.routes');
const laporanRoutes = require('./routes/laporan.routes'); // laporan bulanan & update cicilan
const adminValidIdRoutes = require('./routes/adminValidId.routes');
const lupaPasswordRoutes = require('./routes/lupaPassword.routes');
const pinjamanRoutes = require('./routes/pinjaman.routes'); // pinjaman & update cicilan

// ================== USE ROUTES ==================
app.use('/api/auth', authRoutes);
app.use('/api/pengajuan', pengajuanRoutes);
app.use('/api/laporan-bulanan', laporanRoutes); // untuk laporan bulanan
app.use('/api/admin', adminValidIdRoutes);
app.use('/api/lupa-password', lupaPasswordRoutes);
app.use('/api/pinjaman', pinjamanRoutes); // endpoint pinjaman

// ================== ROOT ==================
app.get('/', (req, res) => res.send('✅ API berjalan'));

// ================== ERROR HANDLING ==================
app.use((req, res) =>
  res.status(404).json({ message: '❌ Endpoint tidak ditemukan' })
);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: '❌ Internal Server Error' });
});

// ================== MONGODB CONNECT ==================
const MONGO_URI = 'mongodb://127.0.0.1:27017/pengajuan_dana';

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
