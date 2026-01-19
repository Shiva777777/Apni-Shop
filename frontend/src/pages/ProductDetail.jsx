
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const ProductDetail = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProduct();
    }, [slug]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/products/${slug}/`);
            setProduct(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Product not found');
            navigate('/products');
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            toast.info('Please login to add items to cart');
            navigate('/login');
            return;
        }

        try {
            await api.post('/orders/cart/add_item/', {
                product_id: product.id,
                quantity: quantity
            });
            toast.success(`${quantity} ${product.name} added to cart!`);
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add to cart');
        }
    };

    if (loading) return (
        <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <div style={{ color: 'var(--primary)', fontWeight: '600' }}>Loading product details...</div>
            </div>
        </div>
    );

    if (!product) return null;

    const allImages = product.images && product.images.length > 0
        ? product.images
        : [{ image: product.primary_image }];

    return (
        <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px' }}>
            <Navbar />
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '4rem' }}>

                    {/* Left: Image Gallery */}
                    <div className="animate-fade-in">
                        <div className="card" style={{
                            aspectRatio: '1/1',
                            backgroundColor: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            marginBottom: '1.5rem',
                            padding: '2rem'
                        }}>
                            {allImages[selectedImage]?.image ? (
                                <img
                                    src={allImages[selectedImage].image}
                                    alt={product.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'var(--transition)' }}
                                />
                            ) : (
                                <div style={{ fontSize: '100px', opacity: 0.1 }}>📦</div>
                            )}
                        </div>
                        {allImages.length > 1 && (
                            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                                {allImages.map((img, idx) => (
                                    <button
                                        key={img.id || idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className="card"
                                        style={{
                                            width: '90px',
                                            height: '90px',
                                            padding: '8px',
                                            flexShrink: 0,
                                            borderColor: selectedImage === idx ? 'var(--primary)' : 'var(--border)',
                                            borderWidth: selectedImage === idx ? '2px' : '1px'
                                        }}
                                    >
                                        <img src={img.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Details */}
                    <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '800',
                            textTransform: 'uppercase',
                            marginBottom: '1.5rem'
                        }}>
                            {product.category_name}
                        </div>

                        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{product.name}</h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#fff7ed', padding: '4px 10px', borderRadius: '6px' }}>
                                <span style={{ color: '#f59e0b', fontSize: '16px' }}>★</span>
                                <span style={{ fontWeight: '700', color: '#78350f' }}>{product.average_rating || '4.5'}</span>
                            </div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
                                {product.total_reviews || '0'} verified reviews
                            </span>
                        </div>

                        <div style={{ marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text)' }}>
                                    ₹{product.discounted_price || product.price}
                                </span>
                                {product.discount_percentage > 0 && (
                                    <>
                                        <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                                            ₹{product.price}
                                        </span>
                                        <span style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '14px', fontWeight: '800' }}>
                                            SAVE {parseInt(product.discount_percentage)}%
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '3rem' }}>
                            {product.description}
                        </p>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
                            <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '12px' }}>
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'none', fontSize: '20px', fontWeight: '600' }}
                                >-</button>
                                <span style={{ padding: '0 20px', fontWeight: '800', fontSize: '18px' }}>{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'none', fontSize: '20px', fontWeight: '600' }}
                                >+</button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="btn btn-primary"
                                style={{ flex: 1, padding: '1.25rem', fontSize: '18px', borderRadius: '14px' }}
                            >
                                {product.stock > 0 ? (
                                    <><span style={{ marginRight: '8px' }}>🛒</span> Add to Shopping Bag</>
                                ) : 'Out of Stock'}
                            </button>
                        </div>

                        {/* Quality Badges */}
                        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🚚</div>
                                    <span style={{ fontSize: '14px', fontWeight: '600' }}>Express Delivery</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔄</div>
                                    <span style={{ fontSize: '14px', fontWeight: '600' }}>Easy 7-Day Returns</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛡️</div>
                                    <span style={{ fontSize: '14px', fontWeight: '600' }}>Secure Payments</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✨</div>
                                    <span style={{ fontSize: '14px', fontWeight: '600' }}>Authentic Product</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @media (max-width: 991px) {
                    .container > div { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};


export default ProductDetail;
