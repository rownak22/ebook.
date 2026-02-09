import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ book }) => {
    const navigate = useNavigate();

    const handleReadClick = () => {
        navigate(`/reader/${book._id}`);
    };

    const handleDownload = async () => {
        try {
            // Increment download count
            await fetch(`http://localhost:5000/api/books/${book._id}/download`, {
                method: 'POST'
            });
            
            // Download book
            window.open(book.fileUrl, '_blank');
        } catch (error) {
            console.error('Download error:', error);
        }
    };

    return (
        <div className="book-card">
            <div className="book-cover">
                <img 
                    src={book.coverImage || '/default-cover.jpg'} 
                    alt={book.title}
                    onClick={handleReadClick}
                />
            </div>
            
            <div className="book-info">
                <h3 className="book-title" onClick={handleReadClick}>
                    {book.title}
                </h3>
                <p className="book-author">by {book.author}</p>
                <p className="book-description">
                    {book.description.length > 100 
                        ? `${book.description.substring(0, 100)}...` 
                        : book.description}
                </p>
                
                <div className="book-genres">
                    {book.genre && book.genre.slice(0, 3).map((g, index) => (
                        <span key={index} className="genre-tag">{g}</span>
                    ))}
                </div>
                
                <div className="book-stats">
                    <span className="rating">⭐ {book.ratings || 'N/A'}</span>
                    <span className="pages">📖 {book.pageCount || '?'} pages</span>
                    <span className="downloads">⬇️ {book.downloads || 0}</span>
                </div>
                
                <div className="book-actions">
                    <button className="read-btn" onClick={handleReadClick}>
                        Read Now
                    </button>
                    <button className="download-btn" onClick={handleDownload}>
                        Download
                    </button>
                    <button className="favorite-btn">
                        ❤️
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
