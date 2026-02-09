import React, { useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import BookCard from '../components/BookCard';
import CategoryFilter from '../components/CategoryFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import './Home.css';

const Home = () => {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [selectedGenre, setSelectedGenre] = useState('All');

    const fetchBooks = useCallback(async (pageNum = 1) => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5000/api/books?page=${pageNum}&limit=10${
                    selectedGenre !== 'All' ? `&genre=${selectedGenre}` : ''
                }`
            );
            const data = await response.json();
            
            if (pageNum === 1) {
                setBooks(data.books);
            } else {
                setBooks(prev => [...prev, ...data.books]);
            }
            
            setHasMore(data.hasMore);
            setPage(pageNum);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedGenre]);

    useEffect(() => {
        fetchBooks(1);
    }, [fetchBooks]);

    const loadMoreBooks = () => {
        fetchBooks(page + 1);
    };

    const handleGenreChange = (genre) => {
        setSelectedGenre(genre);
        setPage(1);
        setBooks([]);
    };

    return (
        <div className="home-container">
            {/* Hero Section */}
            <div className="hero-section">
                <h1>Discover Your Next Favorite Book</h1>
                <p>Thousands of eBooks at your fingertips</p>
            </div>

            {/* Category Filter */}
            <CategoryFilter 
                selectedGenre={selectedGenre} 
                onGenreChange={handleGenreChange}
            />

            {/* Books Grid with Infinite Scroll */}
            <InfiniteScroll
                dataLength={books.length}
                next={loadMoreBooks}
                hasMore={hasMore}
                loader={<LoadingSpinner />}
                endMessage={
                    <p style={{ textAlign: 'center', padding: '20px' }}>
                        <b>You've seen all books!</b>
                    </p>
                }
            >
                <div className="books-grid">
                    {books.map((book) => (
                        <BookCard key={book._id} book={book} />
                    ))}
                </div>
            </InfiniteScroll>

            {loading && books.length === 0 && <LoadingSpinner />}
        </div>
    );
};

export default Home;
