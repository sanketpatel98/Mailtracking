import { connectDb } from '../database/database.js';

export const logTrackingData = async (logData) => {
    const db = await connectDb();
    const logsCollection = db.collection('logs');
    await logsCollection.insertOne(logData);
    console.log("Logged tracking data:", logData);
};

export const getTrackingLogs = async () => {
    const db = await connectDb();
    const logsCollection = db.collection('logs');
    return await logsCollection.find({}).toArray();
};
