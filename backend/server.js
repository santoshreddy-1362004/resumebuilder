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

app.use(cors());

connectDB();


// Middleware
app.use(express.json());
app.use('/api/auth', userRouter);
app.use('/api/resume', resumeRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, path) => {
        res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
    }
})
);

//routes
app.get("/",(req,res)=>{
    res.send("Welcome to the backend server");
})

app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
})

