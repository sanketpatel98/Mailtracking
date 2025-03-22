import { connectDb } from "../database/database.js";

export const logTrackingData = async (logData) => {
  const db = await connectDb();
  const logsCollection = db.collection("logs");

  const userExists = await logsCollection.countDocuments({
    user: logData.user,
  });

  if (userExists) {
    await logsCollection.updateOne(
      { user: logData.user },
      {
        $inc: { count: 1 },
        $set: { lastOpenedTimeStamp: new Date().toISOString() },
      }
    );
    return;
  }
  await logsCollection.insertOne(logData);
};

export const getTrackingLogs = async (userId) => {
  const db = await connectDb();
  const logsCollection = db.collection("logs");
  return await logsCollection.find({ user: userId }).toArray();
};

export const deleteTrackingLogs = async (userId) => {
  const db = await connectDb();
  const logsCollection = db.collection("logs");
  return await logsCollection.deleteOne({ user: userId });
}
