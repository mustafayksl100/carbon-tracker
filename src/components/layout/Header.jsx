import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiHome, FiClipboard, FiBarChart2, FiHeart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import './Header.css';

export default function Header() {
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
        { path: '/survey', label: 'Anket', icon: <FiClipboard /> },
        { path: '/results', label: 'Sonuçlar', icon: <FiBarChart2 /> },
        { path: '/donations', label: 'Bağış', icon: <FiHeart /> },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="header-logo">
                    <img src="/logo.png" alt="CarbonTrack" className="logo-icon" />
                    <span className="logo-text">CarbonTrack</span>
                </Link>

                {isAuthenticated && (
                    <>
                        {/* Dark overlay when menu is open */}
                        {mobileMenuOpen && (
                            <div
                                className="mobile-menu-overlay"
                                onClick={() => setMobileMenuOpen(false)}
                            />
                        )}
                        <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="nav-icon">{link.icon}</span>
                                    <span className="nav-label">{link.label}</span>
                                </Link>
                            ))}
                        </nav>

                        <div className="header-actions">
                            <Link to="/profile" className="profile-link">
                                <div className="profile-avatar">
                                    {user?.profileImage ? (
                                        <img src={user.profileImage} alt="Profil" />
                                    ) : (
                                        <FiUser />
                                    )}
                                </div>
                                <span className="profile-name">{user?.username || 'Kullanıcı'}</span>
                            </Link>
                            <button className="logout-btn" onClick={logout} title="Çıkış Yap">
                                <FiLogOut />
                            </button>
                        </div>

                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <FiX /> : <FiMenu />}
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}
