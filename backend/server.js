import express from "express";
import cors  from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRouter.js";

import path from 'path';
import {fileURLToPath} from 'url';
import resumeRouter from "./routes/resumeRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT=4000;

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174', 
        'http://localhost:5175',
        'http://localhost:5176',
        'http://localhost:5177',
        'http://localhost:5178',
        'https://didactic-guide-g45pq9v4v9j53vjxx-5173.app.github.dev',
        'https://didactic-guide-g45pq9v4v9j53vjxx-5174.app.github.dev',
        'https://didactic-guide-g45pq9v4v9j53vjxx-5175.app.github.dev',
        'https://didactic-guide-g45pq9v4v9j53vjxx-5176.app.github.dev',
        'https://didactic-guide-g45pq9v4v9j53vjxx-5177.app.github.dev',
        'https://didactic-guide-g45pq9v4v9j53vjxx-5178.app.github.dev'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 200
}));

connectDB();

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
    next();
});

// Middleware
app.use(express.json());
app.use('/api/auth', userRouter);
app.use('/api/resume', resumeRouter);

// Serve static files from uploads folder with CORS
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//routes
app.get("/",(req,res)=>{
    res.send("Welcome to the backend server");
})

app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
})

