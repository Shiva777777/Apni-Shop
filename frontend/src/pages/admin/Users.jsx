
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/accounts/users/');
            setUsers(response.data.results || response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load user database');
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <div style={{ color: 'var(--primary)', fontWeight: '600' }}>Accessing user records...</div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Review and manage all registered accounts on the platform</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-outline" style={{ fontSize: '13px', padding: '10px 20px' }}>Export Directory</button>
                </div>
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#fafbfc', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Identity</th>
                            <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Clearance</th>
                            <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Access Status</th>
                            <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registration Date</th>
                            <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Commands</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="animate-fade-in" style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }}>
                                <td style={{ padding: '16px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '12px',
                                            backgroundColor: user.role === 'ADMIN' ? 'var(--primary-light)' : '#f1f5f9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: user.role === 'ADMIN' ? 'var(--primary)' : 'var(--text-muted)',
                                            fontWeight: '800',
                                            fontSize: '14px',
                                            border: `1px solid ${user.role === 'ADMIN' ? 'var(--primary-light)' : '#e2e8f0'}`
                                        }}>
                                            {user.first_name?.[0] || user.email?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text)' }}>{user.full_name || 'Anonymous User'}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '16px 24px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        fontSize: '10px',
                                        fontWeight: '800',
                                        textTransform: 'uppercase',
                                        backgroundColor: user.role === 'ADMIN' ? 'var(--primary-light)' : '#f8fafc',
                                        color: user.role === 'ADMIN' ? 'var(--primary)' : 'var(--text-muted)',
                                        border: '1px solid currentColor'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 24px' }}>
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        backgroundColor: user.is_active ? 'var(--success-light)' : '#fee2e2',
                                        color: user.is_active ? 'var(--success)' : 'var(--danger)'
                                    }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
                                        {user.is_active ? 'ENABLED' : 'SUSPENDED'}
                                    </div>
                                </td>
                                <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                    {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                                <td style={{ padding: '16px 24px' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button style={{ background: 'none', fontSize: '18px', cursor: 'pointer', opacity: 0.6 }}>📝</button>
                                        <button style={{ background: 'none', fontSize: '18px', cursor: 'pointer', opacity: 0.6 }}>🛡️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export default AdminUsers;
