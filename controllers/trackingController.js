import { logTrackingData, getTrackingLogs } from '../services/trackingService.js';
import path from 'path';
import fs from 'fs';

// Handle tracking pixel requests (log the open)
export const trackPixel = async (req, res) => {
    
    const logEntry = {
        timestamp: new Date().toISOString(),
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        referrer: req.headers['referer'] || 'Direct',
    };

    // Save log data to MongoDB
    await logTrackingData(logEntry);

    // Serve the 1x1 transparent pixel
    const pixelPath = path.join(process.cwd(), 'public', 'pixel.png');
    res.sendFile(pixelPath);
};

// Get all tracking logs
export const getLogs = async (req, res) => {
    try {
        const logs = await getTrackingLogs();
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving logs' });
    }
};
