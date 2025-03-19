import express from 'express';
import dotenv from 'dotenv';
// import trackingRoutes from './routes/trackingRoutes.js';

dotenv.config(); // Load environment variables from .env file

console.log("MongoDB URI:", process.env.MONGODB_URI); // Debugging

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Parse incoming JSON requests

// Use tracking routes
// app.use('/api', trackingRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
