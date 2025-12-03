import Book from "../models/Book.js"

export const createBook = async (req, res) => {
    try {
        const { title, author, subtitle, chapters } = req.body;
        if (!title || !author) {
            return res.status(400).json({ message: "Please provide a title and author" })
        }

        const book = await Book.create({
            userId: req.user?._id || "675a1234567890abcdef1234",
            title,
            author,
            subtitle,
            chapters
        });
        res.status(201).json(book)

    } catch (error) {
        console.error('Create book error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getBooks = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const books = await Book.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(books)

    } catch (error) {
        console.error('Get books error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getBooksById = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }
        if (book.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to view this book" });
        }
        res.status(200).json(book)

    } catch (error) {
        console.error('Get book by ID error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateBook = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }

        if (book.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to update this book" });
        }

        const updateBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.status(200).json(updateBook);

    } catch (error) {
        console.error('Update book error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteBook = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }

        if (book.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to delete this book" });
        }

        await book.deleteOne();

        res.status(200).json({ message: "Book deleted successfully" });

    } catch (error) {
        console.error('Delete book error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateBookCover = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }

        if (book.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to update this book" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        book.coverImage = `/${req.file.path}`;
        const updateBook = await book.save();

        res.status(200).json(updateBook);

    } catch (error) {
        console.error('Update book cover error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};