import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await login(formData.email, formData.password, true);

        setLoading(false);

        if (result.success) {
            toast.success('Admin login successful!');
            navigate('/admin/dashboard');
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className="auth-container admin-login">
            <div className="auth-card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
                    <h2 style={{ margin: 0 }}>Admin Panel</h2>
                    <p style={{ color: '#64748b', margin: '0.5rem 0 0' }}>Secure merchant access</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="admin@example.com"
                            style={{ paddingRight: '12px' }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                style={{ paddingRight: '45px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    padding: '4px',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#64748b'
                                }}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{ width: '100%', marginTop: '1rem', padding: '12px', fontSize: '16px' }}
                    >
                        {loading ? 'Authenticating...' : 'Sign In to Admin'}
                    </button>
                </form>

                <div className="auth-links">
                    <p>Not an admin? <Link to="/login">User Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
