import path from "path";
import {
  getTrackingLogs,
  logTrackingData,
} from "../services/trackingService.js";

// Handle tracking pixel requests (log the open)
export const trackPixel = async (req, res) => {
  try {
    const id = req.params.id;
    const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const logEntry = {
      timestamp: new Date().toISOString(),
      lastOpenedTimeStamp: new Date().toISOString(),
      ip: clientIP,
      user: id || "Unknown",
      count: 0,
    };

    // Save log data to MongoDB
    await logTrackingData(logEntry);

    // Serve a 1x1 transparent pixel from memory
    const transparentPixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/KhFtgAAAABJRU5ErkJggg==",
      "base64"
    );

    res.setHeader("Access-Control-Allow-Origin", "*"); // Or specify your domain
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.end(transparentPixel);
  } catch (error) {
    console.error("Error in trackPixel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all tracking logs
export const getLogs = async (req, res) => {
  try {
    const user = req.params.id;
    const logs = await getTrackingLogs(user);
    res.json(logs);
  } catch (error) {
    console.error("Error retrieving logs:", error);
    res.status(500).json({ message: "Error retrieving logs" });
  }
};
