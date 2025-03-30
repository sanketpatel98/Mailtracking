import { connectDb } from "../database/database.js";

export const addTempIPLog = async (ip) => {
  const db = await connectDb();
  const logsCollection = db.collection("tempLogs");

  const tempLog = {
    ip: ip,
    createdTimeStamp: new Date().toISOString(),
  };

  await logsCollection.insertOne(tempLog);
}