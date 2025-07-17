// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import explanationRoutes from './routes/explanationRoutes.js';
import quizRoutes from './routes/quizRoutes.js'; 

 const allowedOrigins = [
             'http://localhost:5173', // For local development
             'https://course-frontend-app.onrender.com' 
          ];

dotenv.config();
const app = express(); // Added comment to trigger redeploy
connectDB();
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
         return callback(null, true);
    }
})); 
 
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', explanationRoutes);
app.use('/api', quizRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
