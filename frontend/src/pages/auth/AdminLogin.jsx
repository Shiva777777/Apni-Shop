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
                <h2>Admin Login</h2>
                <p className="auth-subtitle">Access the admin dashboard</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Admin Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter admin email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter admin password"
                        />
                    </div>

                    <button type="submit" className="btn-primary admin-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Admin Login'}
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
