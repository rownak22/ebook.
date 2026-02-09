import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navButtons = [
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/library', label: 'Library', icon: '📚' },
        { path: '/search', label: 'Search', icon: '🔍' },
        { path: '/profile', label: 'Profile', icon: '👤' },
        { path: '/settings', label: 'Settings', icon: '⚙️' }
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-brand">
                    <h1>📖 eBookHub</h1>
                </Link>

                {/* Desktop Navigation */}
                <div className="navbar-desktop">
                    {navButtons.map((button) => (
                        <Link
                            key={button.path}
                            to={button.path}
                            className="nav-button"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="nav-icon">{button.icon}</span>
                            <span className="nav-label">{button.label}</span>
                        </Link>
                    ))}
                    
                    {user ? (
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="login-btn">
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    className="mobile-menu-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="navbar-mobile">
                    {navButtons.map((button) => (
                        <Link
                            key={button.path}
                            to={button.path}
                            className="mobile-nav-button"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="mobile-nav-icon">{button.icon}</span>
                            <span className="mobile-nav-label">{button.label}</span>
                        </Link>
                    ))}
                    
                    {user ? (
                        <button 
                            onClick={() => {
                                handleLogout();
                                setMobileMenuOpen(false);
                            }} 
                            className="mobile-logout-btn"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link 
                            to="/login" 
                            className="mobile-login-btn"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Login
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
