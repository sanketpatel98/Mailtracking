import express from 'express';
import dotenv from 'dotenv';
import trackingRoutes from './routes/trackingRoutes.js';
import cors from "cors";
import userRoutes from './routes/userRoutes.js';

dotenv.config(); // Load environment variables from .env file
console.log("MongoDB URI:", process.env.MONGODB_URI); // Debugging


const app = express();
app.use(cors());
app.set('trust proxy', true)
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Parse incoming JSON requests

app.get("/", (req, res) => {
    res.send("Hello from Express on Vercel!");
  });

// Use tracking routes
app.use('/api', trackingRoutes);

// Use User routes
app.use('/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


// Continue making one API that can be used to track email opens. This API should be able to track user info ie. username + token. Also, save them in database to retrive later.