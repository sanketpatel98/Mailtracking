import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let db;
const client = new MongoClient(process.env.MONGODB_URI);

export const connectDb = async () => {
    if (db) return db; // Return existing DB connection if already connected
    try {
        await client.connect();
        db = client.db('emailTracking');
        console.log("Connected to MongoDB");
        return db;
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        throw err;
    }
};
