import express from 'express';
import { trackPixel, getLogs, deleteLogs, createTrackingLog } from '../controllers/trackingController.js';

const router = express.Router();

// Route to serve the tracking pixel
router.get('/track.png/:code', trackPixel);

// Route to get tracking logs
router.get('/logs/:id', getLogs);

router.delete('/logs/:code', deleteLogs);

router.post('/logs/', createTrackingLog);

export default router;
