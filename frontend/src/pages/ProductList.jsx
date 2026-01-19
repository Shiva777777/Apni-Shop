
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar'; // Assuming Navbar exists or I need to create one if missing
// If Navbar is not in components, I'll deal with it. Checking file structure earlier showed Home.jsx, etc.
// Let's assume standard layout.

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
        <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
            <Navbar />
            <div className="container">
                {/* Page Title */}
                <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Premium Store</h1>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        Browse through our exclusive collection of high-quality products.
                    </p>
                </div>

                {/* Filters */}
                <div className="glass" style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    alignItems: 'center'
                }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Filter by Category</span>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button
                            onClick={() => setSelectedCategory('')}
                            className={selectedCategory === '' ? 'btn btn-primary' : 'btn btn-outline'}
                            style={{ padding: '0.5rem 1.25rem', fontSize: '14px', borderRadius: 'var(--radius-full)' }}
                        >
                            All Products
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={selectedCategory === cat.id ? 'btn btn-primary' : 'btn btn-outline'}
                                style={{ padding: '0.5rem 1.25rem', fontSize: '14px', borderRadius: 'var(--radius-full)' }}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                        <div style={{ color: 'var(--primary)', fontWeight: '600' }}>Discovering products...</div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📦</div>
                        <h3>No products found</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Try selecting a different category or check back later.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '2rem'
                    }}>
                        {products.map(product => (
                            <Link to={`/products/${product.slug}`} key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ height: '240px', backgroundColor: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
                                    {product.primary_image ? (
                                        <img src={product.primary_image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition)' }}
                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', opacity: 0.2 }}>🛍️</div>
                                    )}
                                    {product.discount_percentage > 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '12px',
                                            right: '12px',
                                            backgroundColor: 'var(--danger)',
                                            color: 'white',
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: '800',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                        }}>
                                            {parseInt(product.discount_percentage)}% OFF
                                        </div>
                                    )}
                                </div>
                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                                        {product.category_name}
                                    </span>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text)', transition: 'var(--transition)' }}>
                                        {product.name}
                                    </h3>

                                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            {product.discount_percentage > 0 ? (
                                                <>
                                                    <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)' }}>₹{product.discounted_price}</span>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{product.price}</span>
                                                </>
                                            ) : (
                                                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)' }}>₹{product.price}</span>
                                            )}
                                        </div>
                                        <div style={{
                                            padding: '8px 12px',
                                            borderRadius: 'var(--radius)',
                                            backgroundColor: 'var(--primary-light)',
                                            color: 'var(--primary)',
                                            fontWeight: '700',
                                            fontSize: '13px'
                                        }}>
                                            Details →
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


export default ProductList;
