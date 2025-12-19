const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporan.controller');

// Ambil rekap laporan bulanan
router.get('/', laporanController.getLaporanBulanan);

// Update status cicilan pinjaman (1, 2, 3 bulan / lunas)
router.patch('/:id/cicilan', laporanController.updateCicilan);

module.exports = router;
