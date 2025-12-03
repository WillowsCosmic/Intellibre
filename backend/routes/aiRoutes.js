import express from "express"
import protect from "../middlewares/authMiddleware.js"
import { generateChapterContent, generateOutline } from "../controller/aiController.js";


const AiRouter = express.Router()
AiRouter.use(protect);

AiRouter.post('/generate-outline',generateOutline)
AiRouter.post('/generate-chapter-content',generateChapterContent)

export default AiRouter

