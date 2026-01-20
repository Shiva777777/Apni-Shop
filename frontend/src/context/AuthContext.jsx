import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password, isAdmin = false) => {
        try {
            const endpoint = isAdmin ? 'accounts/admin/login/' : 'accounts/login/';
            const response = await api.post(endpoint, { email, password });

            const { tokens, user: userData } = response.data;

            localStorage.setItem('accessToken', tokens.access);
            localStorage.setItem('refreshToken', tokens.refresh);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            return { success: true, user: userData };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.non_field_errors?.[0] || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('accounts/register/', userData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
