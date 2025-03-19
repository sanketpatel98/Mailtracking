import express from 'express';
import { trackPixel, getLogs } from '../controllers/trackingController.js';

const router = express.Router();

// Route to serve the tracking pixel
router.get('/track.png', trackPixel);

// Route to get tracking logs
router.get('/logs', getLogs);

export default router;
