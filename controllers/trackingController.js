import path from 'path';
import { getTrackingLogs, logTrackingData } from '../services/trackingService.js';

// Handle tracking pixel requests (log the open)
export const trackPixel = async (req, res) => {
    try {
        // Use 'X-Forwarded-For' for real client IP in production environments
        const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        
        const logEntry = {
            timestamp: new Date().toISOString(),
            ip: clientIP,
            userAgent: req.headers['user-agent'],
            referrer: req.headers['referer'] || 'Direct',
        };

        // Save log data to MongoDB
        await logTrackingData(logEntry);
        console.log('Tracking logged:', logEntry);

        // Serve a 1x1 transparent pixel from memory
        const transparentPixel = Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/KhFtgAAAABJRU5ErkJggg==',
            'base64'
        );

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.end(transparentPixel);
    } catch (error) {
        console.error('Error in trackPixel:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all tracking logs
export const getLogs = async (req, res) => {
    try {
        const logs = await getTrackingLogs();
        res.json(logs);
    } catch (error) {
        console.error('Error retrieving logs:', error);
        res.status(500).json({ message: 'Error retrieving logs' });
    }
};
