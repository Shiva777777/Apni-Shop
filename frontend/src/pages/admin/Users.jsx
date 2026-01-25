import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMakeAdminModal, setShowMakeAdminModal] = useState(false);
    const [showAddAdminModal, setShowAddAdminModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [adminFormData, setAdminFormData] = useState({
        email: '',
        username: '',
        first_name: '',
        last_name: '',
        phone: '',
        password: ''
    });

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

    const handleMakeAdmin = (user) => {
        setSelectedUser(user);
        setShowMakeAdminModal(true);
    };

    const confirmMakeAdmin = async () => {
        try {
            await api.patch(`/accounts/admins/${selectedUser.id}/update/`, {
                role: 'ADMIN',
                is_staff: true
            });
            toast.success(`${selectedUser.full_name} is now an admin!`);
            setShowMakeAdminModal(false);
            fetchUsers();
        } catch (error) {
            console.error('Error making admin:', error);
            toast.error('Failed to promote user to admin');
        }
    };

    const handleInputChange = (e) => {
        setAdminFormData({
            ...adminFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/accounts/admins/create/', adminFormData);
            toast.success(`Admin created successfully! Password: ${response.data.generated_password}`);
            setShowAddAdminModal(false);
            setAdminFormData({
                email: '',
                username: '',
                first_name: '',
                last_name: '',
                phone: '',
                password: ''
            });
            fetchUsers();

            // Show password alert
            alert(`Admin Created!\n\nEmail: ${adminFormData.email}\nPassword: ${response.data.generated_password}\n\nPlease save this password securely!`);
        } catch (error) {
            console.error('Error creating admin:', error);
            toast.error(error.response?.data?.error || 'Failed to create admin');
        }
    };

    const handleRemoveAdmin = async (user) => {
        if (!window.confirm(`Remove admin privileges from ${user.full_name}?`)) {
            return;
        }

        try {
            await api.patch(`/accounts/admins/${user.id}/update/`, {
                role: 'USER',
                is_staff: false
            });
            toast.success(`${user.full_name} is now a regular user`);
            fetchUsers();
        } catch (error) {
            console.error('Error removing admin:', error);
            toast.error('Failed to remove admin privileges');
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
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowAddAdminModal(true)}
                        style={{ fontSize: '13px', padding: '12px 24px', fontWeight: '700' }}
                    >
                        + Add New Admin
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div style={{ color: 'white', fontSize: '14px', marginBottom: '0.5rem', opacity: 0.9 }}>Total Users</div>
                    <div style={{ color: 'white', fontSize: '2rem', fontWeight: '800' }}>{users.length}</div>
                </div>
                <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <div style={{ color: 'white', fontSize: '14px', marginBottom: '0.5rem', opacity: 0.9 }}>Admins</div>
                    <div style={{ color: 'white', fontSize: '2rem', fontWeight: '800' }}>
                        {users.filter(u => u.role === 'ADMIN').length}
                    </div>
                </div>
                <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                    <div style={{ color: 'white', fontSize: '14px', marginBottom: '0.5rem', opacity: 0.9 }}>Regular Users</div>
                    <div style={{ color: 'white', fontSize: '2rem', fontWeight: '800' }}>
                        {users.filter(u => u.role === 'USER').length}
                    </div>
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
                            <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
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
                                        padding: '6px 12px',
                                        borderRadius: '8px',
                                        fontSize: '11px',
                                        fontWeight: '800',
                                        textTransform: 'uppercase',
                                        backgroundColor: user.role === 'ADMIN' ? 'var(--primary-light)' : '#f8fafc',
                                        color: user.role === 'ADMIN' ? 'var(--primary)' : 'var(--text-muted)',
                                        border: '1px solid currentColor'
                                    }}>
                                        {user.role === 'ADMIN' ? '🛡️ ADMIN' : '👤 USER'}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 24px' }}>
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        backgroundColor: user.is_active ? 'var(--success-light)' : '#fee2e2',
                                        color: user.is_active ? 'var(--success)' : 'var(--danger)'
                                    }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
                                        {user.is_active ? 'ACTIVE' : 'SUSPENDED'}
                                    </div>
                                </td>
                                <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                    {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                                <td style={{ padding: '16px 24px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {user.role === 'USER' ? (
                                            <button
                                                onClick={() => handleMakeAdmin(user)}
                                                style={{
                                                    padding: '8px 16px',
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    borderRadius: '8px',
                                                    border: '1px solid var(--primary)',
                                                    backgroundColor: 'var(--primary-light)',
                                                    color: 'var(--primary)',
                                                    cursor: 'pointer',
                                                    transition: 'var(--transition)'
                                                }}
                                            >
                                                🛡️ Make Admin
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleRemoveAdmin(user)}
                                                style={{
                                                    padding: '8px 16px',
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    borderRadius: '8px',
                                                    border: '1px solid #f59e0b',
                                                    backgroundColor: '#fef3c7',
                                                    color: '#f59e0b',
                                                    cursor: 'pointer',
                                                    transition: 'var(--transition)'
                                                }}
                                            >
                                                👤 Remove Admin
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Make Admin Confirmation Modal */}
            {showMakeAdminModal && selectedUser && (
                <div className="modal-overlay" onClick={() => setShowMakeAdminModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Promote to Admin</h3>
                            <button className="modal-close" onClick={() => setShowMakeAdminModal(false)}>&times;</button>
                        </div>

                        <div className="modal-body">
                            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                                <div style={{ fontSize: '60px', marginBottom: '1rem' }}>🛡️</div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>
                                    Make {selectedUser.full_name} an Admin?
                                </h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                    This user will have full administrative access to:
                                </p>
                                <div style={{ textAlign: 'left', backgroundColor: '#fafbfc', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                                    <div style={{ marginBottom: '0.75rem', fontWeight: '600' }}>✅ Manage Products & Categories</div>
                                    <div style={{ marginBottom: '0.75rem', fontWeight: '600' }}>✅ Process Orders</div>
                                    <div style={{ marginBottom: '0.75rem', fontWeight: '600' }}>✅ Manage Users</div>
                                    <div style={{ fontWeight: '600' }}>✅ Access Admin Dashboard</div>
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--danger)', fontWeight: '600' }}>
                                    ⚠️ This action will grant elevated privileges
                                </p>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-outline"
                                onClick={() => setShowMakeAdminModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={confirmMakeAdmin}
                            >
                                Confirm & Make Admin
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add New Admin Modal */}
            {showAddAdminModal && (
                <div className="modal-overlay" onClick={() => setShowAddAdminModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Create New Admin User</h3>
                            <button className="modal-close" onClick={() => setShowAddAdminModal(false)}>&times;</button>
                        </div>

                        <form onSubmit={handleCreateAdmin}>
                            <div className="modal-body">
                                <div style={{ display: 'grid', gap: '1.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className="form-group">
                                            <label>First Name *</label>
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={adminFormData.first_name}
                                                onChange={handleInputChange}
                                                required
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Last Name *</label>
                                            <input
                                                type="text"
                                                name="last_name"
                                                value={adminFormData.last_name}
                                                onChange={handleInputChange}
                                                required
                                                className="form-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={adminFormData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Username *</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={adminFormData.username}
                                            onChange={handleInputChange}
                                            required
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={adminFormData.phone}
                                            onChange={handleInputChange}
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Password (Optional)</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={adminFormData.password}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            placeholder="Leave empty for auto-generated password"
                                        />
                                        <small style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                            If not provided, default password will be "admin@123"
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setShowAddAdminModal(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Create Admin
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};


export default AdminUsers;
