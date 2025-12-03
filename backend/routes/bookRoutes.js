import express from "express"
import upload from "../middlewares/uploadMiddleware.js"
import {
    createBook,
    deleteBook,
    getBooks,
    getBooksById,
    updateBook,
    updateBookCover
} from "../controller/bookController.js"
import protect from "../middlewares/authMiddleware.js"


const BookRouter = express.Router()


BookRouter.post('/',protect, createBook)
BookRouter.get('/',protect, getBooks)
BookRouter.get('/:id',protect, getBooksById)
BookRouter.put('/:id',protect, updateBook)
BookRouter.delete('/:id',protect, deleteBook)
BookRouter.put('/cover/:id',protect, upload, updateBookCover)

export default BookRouter

