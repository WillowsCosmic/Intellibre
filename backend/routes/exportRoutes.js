import express from "express"
import upload from "../middlewares/uploadMiddleware.js"

import protect from "../middlewares/authMiddleware.js"
import { exportAsDocument, exportAsPDF } from "../controller/exportController.js"


const ExportRouter = express.Router()


ExportRouter.get('/:id/pdf',protect, exportAsPDF)
ExportRouter.get('/:id/doc',protect, exportAsDocument)

export default ExportRouter

