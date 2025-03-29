import { connectDb } from "../database/database.js";
import crypto from "crypto";

export const logTrackingData = async (code) => {
  const db = await connectDb();
  const logsCollection = db.collection("logs");

  const userExists = await logsCollection.countDocuments({
    code: code,
  });

  if (userExists) {
    await logsCollection.updateOne(
      { code: code },
      {
        $inc: { count: 1 },
        $set: { lastOpenedTimeStamp: new Date().toISOString() },
      }
    );
    return;
  }
  throw new Error("User does not exist");
};

export const getTrackingLogs = async (username) => {
  const db = await connectDb();
  const logsCollection = db.collection("logs");
  return await logsCollection.find({ username: username }).toArray();
};

export const deleteTrackingLogs = async (code) => {
  const db = await connectDb();
  const logsCollection = db.collection("logs");
  return await logsCollection.deleteOne({ code: code });
};

export const createTrackingLogs = async (userId, title, ip) => {
  const db = await connectDb();
  const logsCollection = db.collection("logs");

  const hash = crypto
    .createHash("sha256")
    .update(userId + title)
    .digest("hex");
  const pattern = hash.replace(/[^a-zA-Z0-9]/g, "").substring(0, 10);

  const existingLog = await logsCollection.findOne({ code: pattern });

  if (existingLog) {
    throw new Error("Log already exists");
  }

  const trackingLog = {
    username: userId,
    title: title,
    count: 1,
    createdTimeStamp: new Date().toISOString(),
    lastOpenedTimeStamp: new Date().toISOString(),
    ip: ip, // Replace with actual IP if available
    code: pattern,
  };
  await logsCollection.insertOne(trackingLog);
};
