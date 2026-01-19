
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/orders/orders/');
            const orderData = response.data.results || response.data;
            setOrders(Array.isArray(orderData) ? orderData : (orderData ? [orderData] : []));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            const errorMessage = error.response?.data?.detail || error.message || 'Failed to load orders';
            setError(errorMessage);
            toast.error(errorMessage);
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        if (!orderId) return;
        try {
            await api.post(`/orders/orders/${orderId}/update_status/`, { status: newStatus });
            toast.success(`Order protocol updated: ${newStatus} ✨`);
            fetchOrders();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Protocol update failed');
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <div style={{ color: 'var(--primary)', fontWeight: '600' }}>Accessing order logs...</div>
        </div>
    );

    if (error) return (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', border: '1px solid var(--danger)', backgroundColor: '#fef2f2' }}>
            <div style={{ fontSize: '48px', marginBottom: '1.5rem' }}>⚠️</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--danger)', marginBottom: '1rem' }}>Order Log Encryption Error</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error}</p>
            <button onClick={fetchOrders} className="btn btn-primary" style={{ backgroundColor: 'var(--danger)' }}>Attempt Decryption</button>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Monitor and execute order fulfillment protocols</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-outline" style={{ fontSize: '13px', padding: '10px 20px' }}>Generate Report</button>
                </div>
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#fafbfc', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Reference</th>
                                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer Identity</th>
                                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Log Date</th>
                                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monetary Value</th>
                                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status Badge</th>
                                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Protocol Override</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!orders || orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        <div style={{ fontSize: '40px', marginBottom: '1rem' }}>🛍️</div>
                                        <p style={{ fontWeight: '600' }}>No transactional data detected in the current sector.</p>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order?.id || Math.random()} className="animate-fade-in" style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }}>
                                        <td style={{ padding: '16px 24px', fontWeight: '800', color: 'var(--text)', fontSize: '14px' }}>
                                            #{order?.order_number || (order?.id ? order.id.toString().padStart(6, '0') : 'N/A')}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ fontWeight: '700', color: 'var(--text)', fontSize: '14px' }}>{order?.user_email || 'Guest Terminal'}</div>
                                            {order?.user_phone && <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{order.user_phone}</div>}
                                        </td>
                                        <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>
                                            {order?.created_at ? new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                        </td>
                                        <td style={{ padding: '16px 24px', fontWeight: '800', color: 'var(--primary)', fontSize: '15px' }}>₹{order?.total_amount || 0}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{
                                                padding: '6px 14px',
                                                borderRadius: '8px',
                                                fontSize: '11px',
                                                fontWeight: '800',
                                                textTransform: 'uppercase',
                                                backgroundColor:
                                                    order?.status === 'DELIVERED' ? 'var(--success-light)' :
                                                        order?.status === 'CANCELLED' ? '#fee2e2' :
                                                            order?.status === 'SHIPPED' ? 'var(--primary-light)' : '#fef9c3',
                                                color:
                                                    order?.status === 'DELIVERED' ? 'var(--success)' :
                                                        order?.status === 'CANCELLED' ? 'var(--danger)' :
                                                            order?.status === 'SHIPPED' ? 'var(--primary)' : '#854d0e',
                                                border: '1px solid currentColor'
                                            }}>
                                                {order?.status || 'PENDING'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            {order?.id && (
                                                <select
                                                    value={order?.status || 'PENDING'}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    style={{
                                                        padding: '8px 12px',
                                                        borderRadius: '8px',
                                                        border: '1px solid var(--border)',
                                                        fontSize: '12px',
                                                        backgroundColor: '#fafbfc',
                                                        fontWeight: '700',
                                                        cursor: 'pointer',
                                                        outline: 'none'
                                                    }}
                                                >
                                                    <option value="PENDING">Pending</option>
                                                    <option value="CONFIRMED">Confirmed</option>
                                                    <option value="PROCESSING">Processing</option>
                                                    <option value="SHIPPED">Shipped</option>
                                                    <option value="DELIVERED">Delivered</option>
                                                    <option value="CANCELLED">Cancelled</option>
                                                </select>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};



export default AdminOrders;
