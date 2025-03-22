import { connectDb } from "../database/database.js";

export const addUser = async (username) => {
  const db = await connectDb();
  const logsCollection = db.collection("user");

  const existingUser = await logsCollection.findOne({ username });

  if (existingUser) {
    throw new Error("User exists");
  }

  await logsCollection.insertOne({ username });
};

export const deleteUser = async (username) => { 
  const db = await connectDb();
  const logsCollection = db.collection("user");

  await logsCollection.deleteOne({ username });
}