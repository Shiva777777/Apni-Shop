import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Home.css';
import heroBg from '../assets/hero-bg.png';

const Home = () => {
    return (
        <div className="home-container">
            <Navbar />

            <section className="hero" style={{
                backgroundImage: `url(${heroBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '160px 0 120px'
            }}>
                <div className="container">
                    <div className="hero-content" style={{ animation: 'fadeIn 1s ease-out' }}>
                        <div style={{
                            display: 'inline-flex',
                            padding: '6px 16px',
                            backgroundColor: 'white',
                            borderRadius: '100px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            marginBottom: '1.5rem'
                        }}>
                            <span style={{
                                color: 'var(--primary)',
                                fontWeight: '800',
                                fontSize: '0.8rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                ✨ New Collection Available Now
                            </span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)' }}>Elevate Your <span style={{ color: 'var(--primary)' }}>Style</span> with Apni Shop</h2>
                        <p style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>Experience the future of online shopping with our curated selection of ultra-premium products.</p>
                        <div className="hero-actions">
                            <Link to="/products" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '18px' }}>
                                Shop Collection
                            </Link>
                            <Link to="/products" className="btn glass" style={{ padding: '1rem 2.5rem', fontSize: '18px' }}>
                                View Lookbook
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features container" style={{ marginTop: '-60px', position: 'relative', zIndex: 10 }}>
                <div className="feature-card glass" style={{ border: '1px solid white' }}>
                    <span className="feature-icon">🚀</span>
                    <h3>Swift Delivery</h3>
                    <p>Get your items delivered within 24-48 hours in major cities.</p>
                </div>
                <div className="feature-card glass" style={{ border: '1px solid white' }}>
                    <span className="feature-icon">🔒</span>
                    <h3>Secure Checkout</h3>
                    <p>Your transactions are protected by industry-leading encryption.</p>
                </div>
                <div className="feature-card glass" style={{ border: '1px solid white' }}>
                    <span className="feature-icon">💎</span>
                    <h3>Quality Assured</h3>
                    <p>Every product is handpicked and verified by our experts.</p>
                </div>
                <div className="feature-card glass" style={{ border: '1px solid white' }}>
                    <span className="feature-icon">📞</span>
                    <h3>24/7 Support</h3>
                    <p>Our dedicated team is always here to help you anytime.</p>
                </div>
            </section>
        </div>
    );
};


export default Home;
