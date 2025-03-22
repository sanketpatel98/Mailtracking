import { connectDb } from "../database/database.js";

export const addUser = async (username) => {
  const db = await connectDb();
  const logsCollection = db.collection("user");

  const existingUser = await logsCollection.findOne({ username });

  if (existingUser) {
    throw new Error("User exists");
  }
  const user = {
    username: username,
    totalLinks: 0,
  };

  await logsCollection.insertOne(user);
};

export const deleteUser = async (username) => {
  try {
    const db = await connectDb();
    const logsCollection = db.collection("user");

    const result = await logsCollection.deleteOne({ username });

    if (result.deletedCount === 0) {
      console.log(`No user found with username: ${username}`);
      return { success: false, message: "User not found" };
    }

    console.log(`User deleted successfully: ${username}`);
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "An error occurred" };
  }
};
