import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Reader.css';

const Reader = () => {
    const { bookId } = useParams();
    const { user } = useAuth();
    const { theme, fontSize, fontFamily } = useTheme();
    const [book, setBook] = useState(null);
    const [content, setContent] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [bookmarks, setBookmarks] = useState([]);
    const [showSettings, setShowSettings] = useState(false);
    const readerRef = useRef(null);

    useEffect(() => {
        fetchBook();
        fetchReadingProgress();
        fetchBookmarks();
    }, [bookId]);

    const fetchBook = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/books/${bookId}`);
            const data = await response.json();
            setBook(data);
            
            // Simulate loading book content (in real app, fetch actual book content)
            setContent(`Chapter 1: ${data.title}\n\n${data.description}\n\n`.repeat(50));
            setTotalPages(Math.ceil(data.pageCount || 100));
        } catch (error) {
            console.error('Error fetching book:', error);
        }
    };

    const fetchReadingProgress = async () => {
        if (!user) return;
        
        try {
            const response = await fetch(`http://localhost:5000/api/users/progress/${bookId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data && data.lastPage) {
                setCurrentPage(data.lastPage);
            }
        } catch (error) {
            console.error('Error fetching progress:', error);
        }
    };

    const fetchBookmarks = async () => {
        if (!user) return;
        
        try {
            const response = await fetch(`http://localhost:5000/api/users/bookmarks/${bookId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setBookmarks(data);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
        }
    };

    const saveProgress = async (page) => {
        if (!user) return;
        
        try {
            await fetch('http://localhost:5000/api/users/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    bookId,
                    pageNumber: page,
                    progress: (page / totalPages) * 100
                })
            });
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    };

    const addBookmark = async () => {
        if (!user) return;
        
        try {
            const response = await fetch('http://localhost:5000/api/users/bookmarks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    bookId,
                    pageNumber: currentPage,
                    note: `Bookmark at page ${currentPage}`
                })
            });
            
            const newBookmark = await response.json();
            setBookmarks([...bookmarks, newBookmark]);
        } catch (error) {
            console.error('Error adding bookmark:', error);
        }
    };

    const goToPage = (page) => {
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;
        
        setCurrentPage(page);
        saveProgress(page);
        
        // Scroll to top of reader
        if (readerRef.current) {
            readerRef.current.scrollTop = 0;
        }
    };

    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);

    const readerStyles = {
        backgroundColor: theme === 'dark' ? '#1a1a1a' : 
                        theme === 'sepia' ? '#f5e9d9' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#000000',
        fontSize: `${fontSize}px`,
        fontFamily: fontFamily,
        lineHeight: '1.8'
    };

    if (!book) {
        return <div className="loading">Loading book...</div>;
    }

    return (
        <div className="reader-container">
            {/* Reader Header */}
            <div className="reader-header">
                <h2>{book.title}</h2>
                <p className="author">by {book.author}</p>
                
                <div className="reader-controls">
                    <button onClick={() => setShowSettings(!showSettings)}>
                        ⚙️ Settings
                    </button>
                    <button onClick={addBookmark}>
                        🔖 Bookmark
                    </button>
                    <div className="page-navigation">
                        <button onClick={prevPage} disabled={currentPage <= 1}>
                            ◀ Previous
                        </button>
                        <span className="page-info">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button onClick={nextPage} disabled={currentPage >= totalPages}>
                            Next ▶
                        </button>
                    </div>
                </div>
            </div>

            {/* Reader Settings Panel */}
            {showSettings && (
                <div className="reader-settings">
                    <h3>Reading Settings</h3>
                    <div className="setting-group">
                        <label>Theme:</label>
                        <select value={theme} onChange={(e) => {/* Update theme */}}>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="sepia">Sepia</option>
                        </select>
                    </div>
                    <div className="setting-group">
                        <label>Font Size:</label>
                        <input 
                            type="range" 
                            min="12" 
                            max="24" 
                            value={fontSize}
                            onChange={(e) => {/* Update fontSize */}}
                        />
                        <span>{fontSize}px</span>
                    </div>
                    <div className="setting-group">
                        <label>Font Family:</label>
                        <select value={fontFamily} onChange={(e) => {/* Update fontFamily */}}>
                            <option value="Arial">Arial</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Courier New">Courier New</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Bookmarks Sidebar */}
            <div className="bookmarks-sidebar">
                <h4>Bookmarks</h4>
                {bookmarks.length === 0 ? (
                    <p>No bookmarks yet</p>
                ) : (
                    bookmarks.map((bookmark, index) => (
                        <div 
                            key={index} 
                            className="bookmark-item"
                            onClick={() => goToPage(bookmark.pageNumber)}
                        >
                            <span>Page {bookmark.pageNumber}</span>
                            {bookmark.note && <small>{bookmark.note}</small>}
                        </div>
                    ))
                )}
            </div>

            {/* Reader Content */}
            <div 
                ref={readerRef}
                className="reader-content"
                style={readerStyles}
            >
                {content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>

            {/* Reader Footer */}
            <div className="reader-footer">
                <div className="progress-bar">
                    <div 
                        className="progress-fill"
                        style={{ width: `${(currentPage / totalPages) * 100}%` }}
                    ></div>
                </div>
                <div className="footer-controls">
                    <input 
                        type="number" 
                        value={currentPage}
                        onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                        min="1"
                        max={totalPages}
                    />
                    <span>/ {totalPages}</span>
                    <button className="jump-btn" onClick={() => goToPage(currentPage)}>
                        Go
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reader;
