const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ebook-platform', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Models
const Book = require('./models/Book');
const User = require('./models/User');
const Review = require('./models/Review');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/users', require('./routes/users'));
app.use('/api/reviews', require('./routes/reviews'));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
