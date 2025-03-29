import path from "path";
import {
  getTrackingLogs,
  logTrackingData,
  deleteTrackingLogs,
  createTrackingLogs
} from "../services/trackingService.js";

// Handle tracking pixel requests (log the open)
export const trackPixel = async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }
    const code = req.params.code;

    // Save log data to MongoDB
    try {
      const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      await logTrackingData(code, userIp);
    } catch (error) {
      console.error("Error logging tracking data:", error);
      return res.status(500).json({ message: "Error logging tracking data" });
    }

    const transparentPixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEklEQVR42mNk+P+/ngEIGGEMADVuBP1gxwDKAAAAAElFTkSuQmCC+AD9hNnAAAAAElFTkSuQmCC",
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
    const username = req.params.id;
    const logs = await getTrackingLogs(username);
    res.json(logs);
  } catch (error) {
    console.error("Error retrieving logs:", error);
    res.status(500).json({ message: "Error retrieving logs" });
  }
};

// Delete tracking logs
export const deleteLogs = async (req, res) => {
  try {
    const code = req.params.code;
    
    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }
    await deleteTrackingLogs(code);
    res.json({ message: "Logs deleted successfully" });
  } catch (error) {
    console.error("Error deleting logs:", error);
    res.status(500).json({ message: "Error deleting logs" });
  }
};

export const createTrackingLog = async (req, res) => {
  try {
    const { userId, title } = req.body;

    // Validate input
    if (!userId || !title) {
      return res.status(400).json({ message: "User ID and title are required" });
    }
    // Fetch user IP address
    const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // Create the tracking log
    await createTrackingLogs(userId, title, userIp);
    res.status(201).json({ message: "Tracking log created successfully" });
  } catch (error) {
    console.error("Error creating tracking log:", error);
    res.status(500).json({ message: "Error creating tracking log" });
  }
}
