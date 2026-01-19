
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/stats/');
            setStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            toast.error('Failed to load dashboard statistics');
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <div style={{ color: 'var(--primary)', fontWeight: '600' }}>Syncing dashboard data...</div>
        </div>
    );

    const statCards = [
        { label: 'Total Revenue', value: `₹${stats?.total_revenue || 0}`, icon: '💰', color: '#10b981', trend: '+12.5%' },
        { label: 'Total Orders', value: stats?.total_orders || 0, icon: '🛍️', color: '#6366f1', trend: '+8.2%' },
        { label: 'Active Products', value: stats?.total_products || 0, icon: '📦', color: '#f59e0b', trend: '+3.1%' },
        { label: 'Verified Users', value: stats?.total_users || 0, icon: '👥', color: '#ec4899', trend: '+1.4%' },
    ];

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                {statCards.map((card, idx) => (
                    <div key={idx} className="card" style={{ padding: '2rem', borderBottom: `4px solid ${card.color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                backgroundColor: `${card.color}15`,
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px'
                            }}>{card.icon}</div>
                            <span style={{
                                fontSize: '12px',
                                fontWeight: '800',
                                color: 'var(--success)',
                                backgroundColor: 'var(--success-light)',
                                padding: '4px 8px',
                                borderRadius: '6px'
                            }}>{card.trend}</span>
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{card.label}</div>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)' }}>{card.value}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Recent Performance</h2>
                        <button className="btn btn-outline" style={{ fontSize: '12px', padding: '6px 12px' }}>Download CSV</button>
                    </div>
                    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fcfcfd', borderRadius: '12px', border: '1px dashed var(--border)', color: 'var(--text-muted)' }}>
                        Performance chart will be displayed here
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '2rem' }}>Operational Status</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', backgroundColor: '#fafbfc', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <span style={{ fontSize: '20px' }}>📦</span>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '14px' }}>Inventory Health</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Products with low stock</div>
                                </div>
                            </div>
                            <span style={{ fontWeight: '800', color: stats?.low_stock_products > 0 ? 'var(--danger)' : 'var(--success)' }}>{stats?.low_stock_products || 0}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', backgroundColor: '#fafbfc', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <span style={{ fontSize: '20px' }}>⏳</span>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '14px' }}>Orders in Waiting</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Orders awaiting confirmation</div>
                                </div>
                            </div>
                            <span style={{ fontWeight: '800', color: stats?.recent_orders_7d > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>{stats?.recent_orders_7d || 0}</span>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                            <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>Refresh Server Cache</button>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @media (max-width: 1024px) {
                    div[style*="grid-template-columns: 1.5fr 1fr"] { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};


export default Dashboard;
