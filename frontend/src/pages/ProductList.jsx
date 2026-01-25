import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [selectedCategory]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let url = '/products/products/';
            if (selectedCategory) {
                url += `?category=${selectedCategory}`;
            }
            const response = await api.get(url);
            setProducts(response.data.results || response.data);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/products/categories/');
            setCategories(response.data.results || response.data);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    return (
        <div style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
            <Navbar />
            <div className="container">
                {/* Page Header */}
                <div style={{ marginBottom: '50px', textAlign: 'center' }} className="animate-fade-in">
                    <div style={{
                        display: 'inline-flex',
                        padding: '8px 20px',
                        backgroundColor: 'var(--primary-light)',
                        borderRadius: '50px',
                        marginBottom: '1.5rem',
                        border: '1px solid var(--primary)'
                    }}>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.05em' }}>
                            ✨ PREMIUM COLLECTION
                        </span>
                    </div>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: '900',
                        marginBottom: '1rem',
                        background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Discover Excellence
                    </h1>
                    <p style={{
                        color: 'var(--text-muted)',
                        maxWidth: '600px',
                        margin: '0 auto',
                        fontSize: '1.1rem',
                        lineHeight: '1.6'
                    }}>
                        Explore our handpicked selection of premium products, curated just for you
                    </p>
                </div>

                {/* Category Filters */}
                <div className="glass animate-fade-in" style={{
                    padding: '2rem',
                    borderRadius: '20px',
                    marginBottom: '50px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(255,255,255,0.5)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        <span style={{ fontSize: '24px' }}>🎯</span>
                        <span style={{
                            fontSize: '16px',
                            fontWeight: '800',
                            color: 'var(--text)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}>
                            Filter by Category
                        </span>
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        <button
                            onClick={() => setSelectedCategory('')}
                            style={{
                                padding: '12px 28px',
                                fontSize: '14px',
                                fontWeight: '700',
                                borderRadius: '50px',
                                border: selectedCategory === '' ? '2px solid var(--primary)' : '2px solid transparent',
                                background: selectedCategory === ''
                                    ? 'linear-gradient(135deg, var(--primary), var(--accent))'
                                    : 'white',
                                color: selectedCategory === '' ? 'white' : 'var(--text)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: selectedCategory === '' ? '0 4px 15px rgba(99, 102, 241, 0.3)' : '0 2px 10px rgba(0,0,0,0.05)',
                                transform: selectedCategory === '' ? 'translateY(-2px)' : 'translateY(0)'
                            }}
                        >
                            ⭐ All Products
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                style={{
                                    padding: '12px 28px',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    borderRadius: '50px',
                                    border: selectedCategory === cat.id ? '2px solid var(--primary)' : '2px solid transparent',
                                    background: selectedCategory === cat.id
                                        ? 'linear-gradient(135deg, var(--primary), var(--accent))'
                                        : 'white',
                                    color: selectedCategory === cat.id ? 'white' : 'var(--text)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: selectedCategory === cat.id ? '0 4px 15px rgba(99, 102, 241, 0.3)' : '0 2px 10px rgba(0,0,0,0.05)',
                                    transform: selectedCategory === cat.id ? 'translateY(-2px)' : 'translateY(0)'
                                }}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            border: '4px solid var(--primary-light)',
                            borderTop: '4px solid var(--primary)',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            marginBottom: '1.5rem'
                        }}></div>
                        <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '18px' }}>Discovering amazing products...</div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="card animate-fade-in" style={{
                        padding: '80px',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                        borderRadius: '24px'
                    }}>
                        <div style={{ fontSize: '80px', marginBottom: '2rem' }}>🔍</div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem' }}>No products found</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                            Try selecting a different category or check back later for new arrivals
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '2.5rem'
                    }}>
                        {products.map(product => (
                            <Link
                                to={`/products/${product.slug}`}
                                key={product.id}
                                className="card animate-fade-in"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                                }}
                            >
                                <div style={{
                                    height: '280px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {product.primary_image ? (
                                        <img
                                            src={product.primary_image}
                                            alt={product.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.5s ease'
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '64px',
                                            color: 'rgba(255,255,255,0.3)'
                                        }}>
                                            🛍️
                                        </div>
                                    )}
                                    {product.discount_percentage > 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '16px',
                                            right: '16px',
                                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                            color: 'white',
                                            padding: '8px 16px',
                                            borderRadius: '12px',
                                            fontSize: '13px',
                                            fontWeight: '900',
                                            boxShadow: '0 4px 15px rgba(245, 87, 108, 0.4)',
                                            border: '2px solid white'
                                        }}>
                                            🔥 {parseInt(product.discount_percentage)}% OFF
                                        </div>
                                    )}
                                    {product.stock <= 10 && product.stock > 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '16px',
                                            left: '16px',
                                            background: 'rgba(255,255,255,0.95)',
                                            color: '#f59e0b',
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            fontSize: '11px',
                                            fontWeight: '800',
                                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                        }}>
                                            ⚡ Only {product.stock} left!
                                        </div>
                                    )}
                                </div>
                                <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column', background: 'white' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                                        <span style={{
                                            fontSize: '11px',
                                            fontWeight: '900',
                                            color: 'var(--primary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.08em',
                                            padding: '4px 10px',
                                            backgroundColor: 'var(--primary-light)',
                                            borderRadius: '6px'
                                        }}>
                                            {product.category_name}
                                        </span>
                                    </div>
                                    <h3 style={{
                                        fontSize: '1.2rem',
                                        fontWeight: '800',
                                        marginBottom: '1rem',
                                        color: 'var(--text)',
                                        lineHeight: '1.4'
                                    }}>
                                        {product.name}
                                    </h3>

                                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {product.discount_percentage > 0 ? (
                                                <>
                                                    <span style={{
                                                        fontSize: '1.5rem',
                                                        fontWeight: '900',
                                                        background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                                                        WebkitBackgroundClip: 'text',
                                                        WebkitTextFillColor: 'transparent'
                                                    }}>
                                                        ₹{product.discounted_price}
                                                    </span>
                                                    <span style={{
                                                        fontSize: '0.9rem',
                                                        color: 'var(--text-muted)',
                                                        textDecoration: 'line-through',
                                                        fontWeight: '600'
                                                    }}>
                                                        ₹{product.price}
                                                    </span>
                                                </>
                                            ) : (
                                                <span style={{
                                                    fontSize: '1.5rem',
                                                    fontWeight: '900',
                                                    background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent'
                                                }}>
                                                    ₹{product.price}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{
                                            padding: '10px 20px',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                            color: 'white',
                                            fontWeight: '800',
                                            fontSize: '14px',
                                            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                                        }}>
                                            View →
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ProductList;
