
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { toast } from 'react-toastify';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await api.get('/orders/cart/');
            if (Array.isArray(response.data) && response.data.length > 0) {
                setCart(response.data[0]);
            } else if (response.data && !Array.isArray(response.data)) {
                setCart(response.data);
            } else {
                setCart(null);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setLoading(false);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await api.post('/orders/cart/remove_item/', { item_id: itemId });
            fetchCart();
            toast.success('Item removed from bag');
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Failed to remove item');
        }
    };

    if (loading) return (
        <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <div style={{ color: 'var(--primary)', fontWeight: '600' }}>Reviewing your bag...</div>
            </div>
        </div>
    );

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh', paddingTop: '100px' }}>
                <Navbar />
                <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <div style={{ fontSize: '80px', marginBottom: '2rem' }}>🛍️</div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Your shopping bag is empty</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem' }}>
                        Discover our new arrivals and find something special for yourself.
                    </p>
                    <Link to="/products" className="btn btn-primary" style={{ padding: '1rem 3rem' }}>
                        Start Exploring
                    </Link>
                </div>
            </div>
        );
    }

    const shippingCharge = parseFloat(cart.subtotal) > 500 ? 0 : 50;
    const finalTotal = parseFloat(cart.subtotal) + shippingCharge;

    return (
        <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
            <Navbar />
            <div className="container">
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Shopping Bag</h1>
                    <p style={{ color: 'var(--text-muted)' }}>You have {cart.items.length} items in your bag</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }}>
                    {/* Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {cart.items.map((item) => (
                            <div key={item.id} className="card animate-fade-in" style={{ display: 'flex', padding: '1.5rem', gap: '1.5rem', alignItems: 'center' }}>
                                <div style={{
                                    width: '120px',
                                    height: '140px',
                                    backgroundColor: '#f1f5f9',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    padding: '10px'
                                }}>
                                    {item.product_details.primary_image ? (
                                        <img src={item.product_details.primary_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', opacity: 0.2 }}>🛍️</div>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <div>
                                            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {item.product_details.category_name}
                                            </span>
                                            <h3 style={{ fontSize: '1.15rem', color: 'var(--text)', marginTop: '4px' }}>{item.product_details.name}</h3>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>₹{item.total_price}</div>
                                            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>₹{item.unit_price} / unit</div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                                        <div style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '6px 16px',
                                            backgroundColor: '#f8fafc',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            fontSize: '14px',
                                            fontWeight: '700'
                                        }}>
                                            Quantity: {item.quantity}
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            style={{
                                                color: 'var(--danger)',
                                                background: 'none',
                                                fontWeight: '700',
                                                fontSize: '14px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <span style={{ fontSize: '18px' }}>🗑️</span> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary Checkout */}
                    <div className="animate-fade-in" style={{ animationDelay: '0.2s', position: 'sticky', top: '100px' }}>
                        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Summary</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                    <span>Subtotal</span>
                                    <span>₹{cart.subtotal}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                    <span>Shipping Estimate</span>
                                    <span>{shippingCharge === 0 ? <span style={{ color: 'var(--success)', fontWeight: '700' }}>FREE</span> : `₹${shippingCharge}`}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                    <span>Tax Estimate</span>
                                    <span>₹0.00</span>
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: '1.5rem' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>Order Total</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>₹{finalTotal}</span>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1.25rem', fontSize: '16px', borderRadius: '12px' }}
                            >
                                Secure Checkout
                            </button>

                            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
                                🛡️ All transactions are 100% secure and encrypted.
                            </p>
                        </div>

                        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <Link to="/products" style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600' }}>
                                ← Continue Shopping
                            </Link>
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


export default Cart;
