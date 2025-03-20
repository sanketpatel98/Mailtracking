import path from "path";
import {
  getTrackingLogs,
  logTrackingData,
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
    // const transparentPixel = Buffer.from(
    //   "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/KhFtgAAAABJRU5ErkJggg==",
    //   "base64"
    // );

    const transparentPixel = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAMgAAAAyCAIAAACWMwO2AAABW0lEQVR4nO3b0Q6CIBhAYWm9/yvTBZsjfzQqzxR2vivXVGicETelnPMine1x9QQ0J8MSwrCEMCwhDEsIwxLCsIQwLCEMSwjDEsKwhDAsIQxLCMMSwrCEMCwhDEsIwxLCsIQwLCGeV0/gAimlcvHxjyTlzv//b/LxPeuUThnuDmYI69tVyTnXj5wybufQe8qzp8zqJoYPq94M1oWp96T1hua20Xy8+bbYzeblKaX+9/TvmoOa5IwV13W9jhf1U8v7SsfrctG//D3vaRY2meHDqlf9hwVrbmDfqsftH33WpIoZfgpLW/EXp3N167b2dqbj03f9+fHo8x3S96TRv15cqnimjsesuPybFDa74NLq4Pj+vVnFSTYrHH5dRv8Cuqfhz1i6J8MSwrCEMCwhDEsIwxLCsIQwLCEMSwjDEsKwhDAsIQxLCMMSwrCEMCwhDEsIwxLCsIQwLCEMS4gX88zGZzWYC6YAAAAASUVORK5CYII=", "base64");


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
