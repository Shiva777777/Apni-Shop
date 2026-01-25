
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { label: 'Categories', path: '/admin/categories', icon: '📁' },
        { label: 'Products', path: '/admin/products', icon: '📦' },
        { label: 'Orders', path: '/admin/orders', icon: '🛍️' },
        { label: 'Users', path: '/admin/users', icon: '👥' },
        { label: 'Inventory', path: '/admin/inventory', icon: '📋' },
    ];

    return (
        <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '280px',
                backgroundColor: 'var(--surface)',
                borderRight: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 100
            }}>
                <div style={{ padding: '32px 24px', marginBottom: '20px' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h2 style={{
                            margin: 0,
                            fontSize: '24px',
                            fontWeight: '800',
                            background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>Apni Shop</h2>
                    </Link>
                    <div style={{
                        marginTop: '8px',
                        display: 'inline-flex',
                        padding: '4px 10px',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: '800',
                        letterSpacing: '0.05em'
                    }}>ADMIN CONSOLE</div>
                </div>

                <nav style={{ flex: 1, padding: '0 16px' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path} style={{ marginBottom: '8px' }}>
                                    <Link
                                        to={item.path}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '12px 18px',
                                            textDecoration: 'none',
                                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                            backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                                            borderRadius: '12px',
                                            fontWeight: isActive ? '700' : '600',
                                            fontSize: '14px',
                                            transition: 'var(--transition)',
                                            border: isActive ? '1px solid var(--primary-light)' : '1px solid transparent'
                                        }}
                                    >
                                        <span style={{
                                            marginRight: '14px',
                                            fontSize: '20px',
                                            opacity: isActive ? 1 : 0.7
                                        }}>{item.icon}</span>
                                        {item.label}
                                        {isActive && <div style={{
                                            marginLeft: 'auto',
                                            width: '6px',
                                            height: '6px',
                                            backgroundColor: 'var(--primary)',
                                            borderRadius: '50%'
                                        }} />}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div style={{ padding: '24px', borderTop: '1px solid var(--border)' }}>
                    <div className="card" style={{
                        padding: '12px',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#fafbfc'
                    }}>
                        <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            backgroundColor: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '800',
                            marginRight: '12px',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                        }}>
                            {user?.first_name?.[0] || 'A'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontWeight: '700', fontSize: '14px', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.full_name || 'Admin User'}</p>
                            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Super Admin ✨</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn btn-outline"
                        style={{
                            width: '100%',
                            padding: '10px',
                            color: 'var(--danger)',
                            borderColor: '#fee2e2',
                            fontSize: '14px'
                        }}
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                padding: '40px 60px',
                marginLeft: '280px',
                minHeight: '100vh',
                backgroundColor: 'var(--background)'
            }}>
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text)' }}>
                            {menuItems.find(i => i.path === location.pathname)?.label || 'Overview'}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Welcome back, {user?.first_name || 'Admin'}!</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}>
                            <span>🔔</span>
                            <span style={{ fontSize: '13px' }}>Notifications</span>
                        </button>
                        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}>
                            <span>⚡</span>
                            <span style={{ fontSize: '13px' }}>System Status</span>
                        </button>
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
};


export default AdminLayout;
