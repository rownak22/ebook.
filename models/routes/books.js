const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const auth = require('../middleware/auth');

// Get all books with pagination (for infinite scroll)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const books = await Book.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Book.countDocuments();

        res.json({
            books,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            hasMore: skip + books.length < total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single book
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search books
router.get('/search/:query', async (req, res) => {
    try {
        const query = req.params.query;
        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).limit(20);

        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get books by genre
router.get('/genre/:genre', async (req, res) => {
    try {
        const books = await Book.find({ genre: req.params.genre });
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new book (Admin only)
router.post('/', auth, async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update book
router.put('/:id', auth, async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete book
router.delete('/:id', auth, async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Increment download count
router.post('/:id/download', async (req, res) => {
    try {
        await Book.findByIdAndUpdate(req.params.id, {
            $inc: { downloads: 1 }
        });
        res.json({ message: 'Download count updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
