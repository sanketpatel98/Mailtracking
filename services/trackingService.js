import { connectDb } from "../database/database.js";

export const logTrackingData = async (token) => {
  const db = await connectDb();
  const logsCollection = db.collection("logs");

  const userExists = await logsCollection.countDocuments({
    user: token,
  });

  if (userExists) {
    await logsCollection.updateOne(
      { user: token },
      {
        $inc: { count: 1 },
        $set: { lastOpenedTimeStamp: new Date().toISOString() },
      }
    );
    return;
  }
  throw new Error("User does not exist");
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
