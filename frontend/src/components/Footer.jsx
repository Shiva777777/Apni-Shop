import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: 'var(--surface)',
            borderTop: '1px solid var(--border)',
            padding: '80px 0 40px',
            marginTop: 'auto'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '40px',
                    marginBottom: '60px'
                }}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <Link to="/" style={{
                            fontSize: '24px',
                            fontWeight: '800',
                            background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textDecoration: 'none',
                            display: 'block',
                            marginBottom: '20px'
                        }}>
                            Apni Shop
                        </Link>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '300px' }}>
                            Redefining the premium shopping experience with curated collections and lightning-fast delivery.
                        </p>
                        <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                            <a href="#" style={{ fontSize: '20px', color: 'var(--text-muted)' }}>𝕏</a>
                            <a href="#" style={{ fontSize: '20px', color: 'var(--text-muted)' }}>📸</a>
                            <a href="#" style={{ fontSize: '20px', color: 'var(--text-muted)' }}>📘</a>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '25px', fontWeight: '700' }}>Shop</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '12px' }}><Link to="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>All Products</Link></li>
                            <li style={{ marginBottom: '12px' }}><Link to="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Featured</Link></li>
                            <li style={{ marginBottom: '12px' }}><Link to="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>New Arrivals</Link></li>
                            <li style={{ marginBottom: '12px' }}><Link to="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Discounts</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '25px', fontWeight: '700' }}>Company</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About Us</a></li>
                            <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Sustainability</a></li>
                            <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</a></li>
                            <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '25px', fontWeight: '700' }}>Support</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Help Center</a></li>
                            <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact Us</a></li>
                            <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Shipping & Returns</a></li>
                        </ul>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: '30px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                        © 2026 Apni Shop Inc. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                        <span style={{ fontSize: '20px', filter: 'grayscale(1)' }}>💳 🏦 📱</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
