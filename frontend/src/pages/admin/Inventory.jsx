import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, low, out
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [stockUpdate, setStockUpdate] = useState({ quantity: 0, action: 'add' });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products/products/');
            setProducts(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    const getFilteredProducts = () => {
        switch (filter) {
            case 'low':
                return products.filter(p => p.stock > 0 && p.stock <= 10);
            case 'out':
                return products.filter(p => p.stock === 0);
            default:
                return products;
        }
    };

    const handleUpdateStock = (product) => {
        setSelectedProduct(product);
        setStockUpdate({ quantity: 0, action: 'add' });
        setShowUpdateModal(true);
    };

    const handleStockSubmit = async (e) => {
        e.preventDefault();

        try {
            const newStock = stockUpdate.action === 'add'
                ? selectedProduct.stock + parseInt(stockUpdate.quantity)
                : selectedProduct.stock - parseInt(stockUpdate.quantity);

            if (newStock < 0) {
                toast.error('Stock cannot be negative!');
                return;
            }

            await api.patch(`/products/products/${selectedProduct.id}/`, {
                stock: newStock
            });

            toast.success(`Stock updated successfully!`);
            setShowUpdateModal(false);
            fetchProducts();
        } catch (error) {
            console.error('Error updating stock:', error);
            toast.error('Failed to update stock');
        }
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { label: 'OUT OF STOCK', color: '#dc2626', bg: '#fee2e2' };
        if (stock <= 10) return { label: 'LOW STOCK', color: '#f59e0b', bg: '#fef3c7' };
        return { label: 'IN STOCK', color: '#16a34a', bg: '#dcfce7' };
    };

    const filteredProducts = getFilteredProducts();
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;
    const totalStockValue = products.reduce((sum, p) => sum + (parseFloat(p.price) * p.stock), 0);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <div style={{ color: 'var(--primary)', fontWeight: '600' }}>Loading inventory data...</div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Inventory Management</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Track and manage product stock levels</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-outline" style={{ fontSize: '13px', padding: '10px 20px' }}>
                        📊 Export Report
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div style={{ color: 'white', fontSize: '14px', marginBottom: '0.5rem', opacity: 0.9 }}>Total Products</div>
                    <div style={{ color: 'white', fontSize: '2rem', fontWeight: '800' }}>{totalProducts}</div>
                </div>
                <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <div style={{ color: 'white', fontSize: '14px', marginBottom: '0.5rem', opacity: 0.9 }}>Low Stock Items</div>
                    <div style={{ color: 'white', fontSize: '2rem', fontWeight: '800' }}>{lowStockCount}</div>
                </div>
                <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                    <div style={{ color: 'white', fontSize: '14px', marginBottom: '0.5rem', opacity: 0.9 }}>Out of Stock</div>
                    <div style={{ color: 'white', fontSize: '2rem', fontWeight: '800' }}>{outOfStockCount}</div>
                </div>
                <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                    <div style={{ color: 'white', fontSize: '14px', marginBottom: '0.5rem', opacity: 0.9 }}>Stock Value</div>
                    <div style={{ color: 'white', fontSize: '2rem', fontWeight: '800' }}>₹{totalStockValue.toLocaleString()}</div>
                </div>
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setFilter('all')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: filter === 'all' ? '2px solid var(--primary)' : '1px solid var(--border)',
                        backgroundColor: filter === 'all' ? 'var(--primary-light)' : 'white',
                        color: filter === 'all' ? 'var(--primary)' : 'var(--text)',
                        fontWeight: '700',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                    }}
                >
                    All Products ({totalProducts})
                </button>
                <button
                    onClick={() => setFilter('low')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: filter === 'low' ? '2px solid #f59e0b' : '1px solid var(--border)',
                        backgroundColor: filter === 'low' ? '#fef3c7' : 'white',
                        color: filter === 'low' ? '#f59e0b' : 'var(--text)',
                        fontWeight: '700',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                    }}
                >
                    Low Stock ({lowStockCount})
                </button>
                <button
                    onClick={() => setFilter('out')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: filter === 'out' ? '2px solid #dc2626' : '1px solid var(--border)',
                        backgroundColor: filter === 'out' ? '#fee2e2' : 'white',
                        color: filter === 'out' ? '#dc2626' : 'var(--text)',
                        fontWeight: '700',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                    }}
                >
                    Out of Stock ({outOfStockCount})
                </button>
            </div>

            {/* Inventory Table */}
            <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#fafbfc', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product</th>
                                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price</th>
                                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stock Level</th>
                                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Value</th>
                                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        <div style={{ fontSize: '40px', marginBottom: '1rem' }}>📦</div>
                                        <p style={{ fontWeight: '600' }}>No products found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => {
                                    const status = getStockStatus(product.stock);
                                    return (
                                        <tr key={product.id} className="animate-fade-in" style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }}>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        borderRadius: '10px',
                                                        backgroundColor: '#f1f5f9',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        overflow: 'hidden'
                                                    }}>
                                                        {product.image ? (
                                                            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <span style={{ fontSize: '24px' }}>📦</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text)' }}>{product.name}</div>
                                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: {product.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                                {product.category?.name || 'N/A'}
                                            </td>
                                            <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '700', color: 'var(--text)' }}>
                                                ₹{parseFloat(product.price).toLocaleString()}
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ fontWeight: '800', fontSize: '18px', color: product.stock === 0 ? '#dc2626' : product.stock <= 10 ? '#f59e0b' : '#16a34a' }}>
                                                    {product.stock}
                                                </div>
                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>units</div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '8px',
                                                    fontSize: '11px',
                                                    fontWeight: '800',
                                                    backgroundColor: status.bg,
                                                    color: status.color,
                                                    border: `1px solid ${status.color}`
                                                }}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '700', color: 'var(--text)' }}>
                                                ₹{(parseFloat(product.price) * product.stock).toLocaleString()}
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <button
                                                    onClick={() => handleUpdateStock(product)}
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
                                                    Update Stock
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Update Stock Modal */}
            {showUpdateModal && selectedProduct && (
                <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Update Stock Level</h3>
                            <button className="modal-close" onClick={() => setShowUpdateModal(false)}>&times;</button>
                        </div>

                        <form onSubmit={handleStockSubmit}>
                            <div className="modal-body">
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#fafbfc', borderRadius: '10px' }}>
                                    <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '0.5rem' }}>{selectedProduct.name}</div>
                                    <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Current Stock: <span style={{ fontWeight: '800', color: 'var(--primary)' }}>{selectedProduct.stock} units</span></div>
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label>Action</label>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => setStockUpdate({ ...stockUpdate, action: 'add' })}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                borderRadius: '8px',
                                                border: stockUpdate.action === 'add' ? '2px solid #16a34a' : '1px solid var(--border)',
                                                backgroundColor: stockUpdate.action === 'add' ? '#dcfce7' : 'white',
                                                color: stockUpdate.action === 'add' ? '#16a34a' : 'var(--text)',
                                                fontWeight: '700',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            ➕ Add Stock
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setStockUpdate({ ...stockUpdate, action: 'remove' })}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                borderRadius: '8px',
                                                border: stockUpdate.action === 'remove' ? '2px solid #dc2626' : '1px solid var(--border)',
                                                backgroundColor: stockUpdate.action === 'remove' ? '#fee2e2' : 'white',
                                                color: stockUpdate.action === 'remove' ? '#dc2626' : 'var(--text)',
                                                fontWeight: '700',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            ➖ Remove Stock
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={stockUpdate.quantity}
                                        onChange={(e) => setStockUpdate({ ...stockUpdate, quantity: e.target.value })}
                                        required
                                        className="form-input"
                                        style={{ fontSize: '18px', fontWeight: '700' }}
                                    />
                                </div>

                                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                                    <div style={{ fontSize: '13px', color: '#16a34a', fontWeight: '600' }}>
                                        New Stock: {stockUpdate.action === 'add'
                                            ? selectedProduct.stock + parseInt(stockUpdate.quantity || 0)
                                            : selectedProduct.stock - parseInt(stockUpdate.quantity || 0)
                                        } units
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline" onClick={() => setShowUpdateModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Update Stock
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
