
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders/orders/');
            setOrders(response.data.results || response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <div style={{ color: 'var(--primary)', fontWeight: '600' }}>Tracing your orders...</div>
            </div>
        </div>
    );

    return (
        <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px' }}>
            <Navbar />
            <div className="container" style={{ maxWidth: '900px' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Your Orders</h1>
                    <p style={{ color: 'var(--text-muted)' }}>History of your premium purchases</p>
                </div>

                {orders.length === 0 ? (
                    <div className="card animate-fade-in" style={{ padding: '4rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '60px', marginBottom: '1.5rem' }}>📦</div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No orders yet</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>When you buy something, it will appear here.</p>
                        <Link to="/products" className="btn btn-outline" style={{ padding: '0.75rem 2rem' }}>Start Shopping</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        {orders.map((order) => (
                            <div key={order.id} className="card animate-fade-in" style={{ overflow: 'hidden' }}>
                                <div style={{
                                    padding: '1.5rem 2rem',
                                    backgroundColor: '#f8fafc',
                                    borderBottom: '1px solid var(--border)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: '1.5rem'
                                }}>
                                    <div style={{ display: 'flex', gap: '2.5rem' }}>
                                        <div>
                                            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Order Placed</div>
                                            <div style={{ fontWeight: '700', fontSize: '14px' }}>{new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Total Amount</div>
                                            <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--primary)' }}>₹{order.total_amount}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Order ID</div>
                                            <div style={{ fontWeight: '700', fontSize: '14px' }}>#{order.order_number}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <span style={{
                                            padding: '6px 14px',
                                            borderRadius: '8px',
                                            fontSize: '11px',
                                            fontWeight: '800',
                                            textTransform: 'uppercase',
                                            backgroundColor: order.status === 'DELIVERED' ? 'var(--success-light)' : 'var(--primary-light)',
                                            color: order.status === 'DELIVERED' ? 'var(--success)' : 'var(--primary)',
                                            border: '1px solid currentColor'
                                        }}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ padding: '2rem' }}>
                                    {order.items && order.items.map((item, idx) => (
                                        <div key={item.id} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1.5rem',
                                            marginBottom: idx === order.items.length - 1 ? 0 : '1.5rem',
                                            paddingBottom: idx === order.items.length - 1 ? 0 : '1.5rem',
                                            borderBottom: idx === order.items.length - 1 ? 'none' : '1px solid #f1f5f9'
                                        }}>
                                            <div style={{ width: '60px', height: '60px', backgroundColor: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                                                📦
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '700', color: 'var(--text)', marginBottom: '4px' }}>{item.product_name}</div>
                                                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Quantity: {item.quantity} units</div>
                                            </div>
                                            <div style={{ fontWeight: '800', color: 'var(--text)', fontSize: '16px' }}>
                                                ₹{item.total_price}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ padding: '1.5rem 2rem', backgroundColor: '#fcfcfd', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                    <button className="btn btn-outline" style={{ fontSize: '12px', padding: '0.5rem 1rem' }}>View Details</button>
                                    <button className="btn btn-primary" style={{ fontSize: '12px', padding: '0.5rem 1rem' }}>Track Order</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
