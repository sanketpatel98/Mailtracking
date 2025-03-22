import path from "path";
import {
  getTrackingLogs,
  logTrackingData,
  deleteTrackingLogs,
} from "../services/trackingService.js";

// Handle tracking pixel requests (log the open)
export const trackPixel = async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }
    const id = req.params.id;

    // Save log data to MongoDB
    try {
      await logTrackingData(id);
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
    const user = req.params.id;
    const logs = await getTrackingLogs(user);
    res.json(logs);
  } catch (error) {
    console.error("Error retrieving logs:", error);
    res.status(500).json({ message: "Error retrieving logs" });
  }
};

// Delete tracking logs
export const deleteLogs = async (req, res) => {
  try {
    const user = req.params.id;
    await deleteTrackingLogs(user);
    res.json({ message: "Logs deleted successfully" });
  } catch (error) {
    console.error("Error deleting logs:", error);
    res.status(500).json({ message: "Error deleting logs" });
  }
};
