import "dotenv/config"

import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js"
import { fileURLToPath } from "url"
import AuthRouter from "./routes/authRoutes.js";
import BookRouter from "./routes/bookRoutes.js";
import AiRouter from "./routes/aiRoutes.js";
import ExportRouter from "./routes/exportRoutes.js";

const app = express();

//Middlewares
//Production level cors setup

app.use(cors({
    origin: process.env.FRONTEND_URL,  
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use("/backend/uploads",express.static(path.join(__dirname,"uploads")));

//Routes

app.use("/api/auth",AuthRouter)
app.use("/api/books",BookRouter)
app.use("/api/ai",AiRouter)
app.use("/api/export",ExportRouter)



const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
