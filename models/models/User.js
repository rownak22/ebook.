const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: 'default-avatar.png'
    },
    readingHistory: [{
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
        },
        lastPage: Number,
        progress: Number,
        lastRead: Date,
        completed: {
            type: Boolean,
            default: false
        }
    }],
    bookmarks: [{
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
        },
        pageNumber: Number,
        note: String,
        createdAt: Date
    }],
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark', 'sepia'],
            default: 'light'
        },
        fontSize: {
            type: Number,
            default: 16
        },
        fontFamily: {
            type: String,
            default: 'Arial'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Password hashing
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
