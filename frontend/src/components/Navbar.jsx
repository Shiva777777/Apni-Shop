
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            transition: 'var(--transition)',
            height: '72px',
            display: 'flex',
            alignItems: 'center'
        }}>
            <div className="container" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'var(--primary)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '20px',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                    }}>🛍️</div>
                    <span style={{
                        fontSize: '22px',
                        fontWeight: '800',
                        fontFamily: 'var(--font-heading)',
                        background: 'linear-gradient(135deg, var(--text) 0%, var(--primary) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>Apni Shop</span>
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{ alignItems: 'center', gap: '2rem' }}>
                    <Link to="/" className="nav-link" style={{ fontWeight: '600', fontSize: '15px' }}>Home</Link>
                    <Link to="/products" className="nav-link" style={{ fontWeight: '600', fontSize: '15px' }}>Store</Link>

                    {isAuthenticated ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            {isAdmin && (
                                <Link to="/admin/dashboard" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '14px' }}>
                                    Dashboard
                                </Link>
                            )}
                            <Link to="/orders" className="nav-link" style={{ fontWeight: '600', fontSize: '15px' }}>Orders</Link>
                            <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border)' }}></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '12px',
                                    backgroundColor: 'var(--primary-light)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--primary)',
                                    fontWeight: 'bold',
                                    border: '1px solid rgba(99, 102, 241, 0.2)'
                                }}>
                                    {user?.first_name?.[0] || 'U'}
                                </div>
                                <button onClick={handleLogout} style={{ background: 'none', color: 'var(--danger)', fontWeight: '600', fontSize: '14px', padding: '4px 8px' }}>
                                    Exit
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Link to="/login" className="nav-link" style={{ fontWeight: '600' }}>Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
                                Get Started
                            </Link>
                        </div>
                    )}

                    <Link to="/cart" style={{ width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', transition: 'var(--transition)' }}>
                        <span style={{ fontSize: '20px' }}>🛒</span>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{ background: 'none', fontSize: '24px', color: 'var(--text)' }}
                    className="mobile-menu-btn"
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {isMenuOpen && (
                <div className="glass" style={{
                    position: 'absolute',
                    top: '72px',
                    left: '16px',
                    right: '16px',
                    padding: '24px',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    boxShadow: 'var(--shadow-lg)',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <Link to="/" onClick={() => setIsMenuOpen(false)} style={{ fontWeight: '600' }}>Home</Link>
                    <Link to="/products" onClick={() => setIsMenuOpen(false)} style={{ fontWeight: '600' }}>Store</Link>
                    <Link to="/cart" onClick={() => setIsMenuOpen(false)} style={{ fontWeight: '600' }}>Cart</Link>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
                    {isAuthenticated ? (
                        <>
                            {isAdmin && <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--primary)', fontWeight: '700' }}>Dashboard</Link>}
                            <Link to="/orders" onClick={() => setIsMenuOpen(false)} style={{ fontWeight: '600' }}>My Orders</Link>
                            <button onClick={handleLogout} style={{ textAlign: 'left', background: 'none', color: 'var(--danger)', fontWeight: '700', padding: 0 }}>Logout</button>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} style={{ fontWeight: '600' }}>Login</Link>
                            <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn btn-primary">Sign Up</Link>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .nav-link {
                    color: var(--text-muted);
                }
                .nav-link:hover {
                    color: var(--primary);
                }
                @media (max-width: 991px) {
                    .desktop-menu { display: none !important; }
                    .mobile-menu-btn { display: block !important; }
                }
                @media (min-width: 992px) {
                    .desktop-menu { display: flex !important; }
                    .mobile-menu-btn { display: none !important; }
                }
            `}</style>
        </nav>
    );
};


export default Navbar;
