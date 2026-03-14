import express from "express";
import cors  from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRouter.js";

import path from 'path';
import {fileURLToPath} from 'url';
import resumeRouter from "./routes/resumeRouter.js";
import { requestMetricsMiddleware, register } from "./metrics.js";
import redis from "./config/redis.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT=4000;

// Build CORS allowlist from env for flexibility across deployments
const envOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'http://localhost:5178',
];

const allowedOrigins = envOrigins.length ? envOrigins : [...defaultOrigins];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        // Allow any GitHub Codespaces origin
        if (origin.endsWith('.app.github.dev')) return callback(null, true);
        // Allow any Render origin
        if (origin.endsWith('.onrender.com')) return callback(null, true);
        // Allow explicitly listed origins
        if (allowedOrigins.includes(origin)) return callback(null, true);
        // Reject unknown origins (return false instead of Error to avoid crashing Express 5)
        callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 200
}));

connectDB();

// Metrics middleware - must be early to track all requests
app.use(requestMetricsMiddleware);

// Metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

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

// Redis health check endpoint
app.get("/api/redis-health", async (req, res) => {
    try {
        await redis.set("health:check", "ok", "EX", 10);
        const val = await redis.get("health:check");
        res.json({ status: "connected", test: val, message: "✅ Upstash Redis is working!" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
})

