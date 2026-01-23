
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const initialFormState = {
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        subcategory: '',
        brand: '',
        discount_percentage: '0'
    };
    const [formData, setFormData] = useState(initialFormState);
    const [images, setImages] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchSubCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products/products/');
            setProducts(response.data.results || response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/admin/categories/');
            setCategories(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSubCategories = async () => {
        try {
            const response = await api.get('/admin/subcategories/');
            setSubcategories(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                discount_percentage: parseFloat(formData.discount_percentage)
            };

            if (!productData.subcategory) delete productData.subcategory;

            const productResponse = await api.post('/products/products/', productData);
            const productId = productResponse.data.id;

            if (images.length > 0) {
                const uploadPromises = Array.from(images).map((file, index) => {
                    const formData = new FormData();
                    formData.append('product', productId);
                    formData.append('image', file);
                    formData.append('is_primary', index === 0);
                    return api.post('/products/images/', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                });

                await Promise.all(uploadPromises);
            }

            toast.success('Inventory updated: Product added ✨');
            setShowModal(false);
            setFormData(initialFormState);
            setImages([]);
            fetchProducts();
        } catch (error) {
            console.error('Error creating product:', error);
            toast.error('Synthesis failed: Could not create product');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
            subcategory: product.subcategory || '',
            brand: product.brand || '',
            discount_percentage: product.discount_percentage || '0'
        });
        setShowModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                discount_percentage: parseFloat(formData.discount_percentage)
            };

            if (!productData.subcategory) delete productData.subcategory;

            await api.put(`/products/products/${editingProduct.id}/`, productData);

            // Upload new images if any
            if (images.length > 0) {
                const uploadPromises = Array.from(images).map((file, index) => {
                    const formData = new FormData();
                    formData.append('product', editingProduct.id);
                    formData.append('image', file);
                    formData.append('is_primary', index === 0);
                    return api.post('/products/images/', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                });

                await Promise.all(uploadPromises);
            }

            toast.success('Product updated successfully! ✨');
            setShowModal(false);
            setFormData(initialFormState);
            setImages([]);
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Failed to update product');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await api.delete(`/products/products/${productId}/`);
            toast.success('Product deleted successfully! 🗑️');
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setFormData(initialFormState);
        setImages([]);
        setEditingProduct(null);
    };

    const filteredSubcategories = subcategories.filter(sub => sub.category === parseInt(formData.category));

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Manage your digital inventory and product catalog</p>
                <button
                    onClick={() => { setEditingProduct(null); setFormData(initialFormState); setImages([]); setShowModal(true); }}
                    className="btn btn-primary"
                    style={{
                        padding: '12px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '14px'
                    }}
                >
                    <span style={{ fontSize: '18px' }}>✨</span> New Product
                </button>
            </div>

            {/* Product List Table */}
            <div className="card" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#fafbfc', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product Identity</th>
                            <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Classification</th>
                            <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pricing</th>
                            <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Availability</th>
                            <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Management</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--primary)', fontWeight: '600' }}>Fetching catalog...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Warehouse empty. Initialize inventory by adding products.</td></tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="animate-fade-in" style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '10px',
                                                backgroundColor: '#f1f5f9',
                                                overflow: 'hidden',
                                                padding: '4px'
                                            }}>
                                                {product.primary_image ? (
                                                    <img src={product.primary_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📦</div>
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)' }}>{product.name}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{product.brand || 'No Brand'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            backgroundColor: 'var(--primary-light)',
                                            color: 'var(--primary)',
                                            fontSize: '11px',
                                            fontWeight: '800',
                                            textTransform: 'uppercase'
                                        }}>
                                            {product.category_name}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text)' }}>₹{product.price}</div>
                                        {product.discount_percentage > 0 && <div style={{ fontSize: '10px', color: 'var(--danger)', fontWeight: '700' }}>{product.discount_percentage}% OFF</div>}
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ fontSize: '14px', fontWeight: '700', color: product.stock > 0 ? 'var(--text)' : 'var(--danger)' }}>{product.stock} units</div>
                                        <div style={{
                                            width: '60px',
                                            height: '4px',
                                            backgroundColor: '#f1f5f9',
                                            borderRadius: '2px',
                                            marginTop: '6px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${Math.min(product.stock, 100)}%`,
                                                height: '100%',
                                                backgroundColor: product.stock > 10 ? 'var(--success)' : 'var(--danger)'
                                            }} />
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => handleEdit(product)} style={{ background: 'none', fontSize: '18px', cursor: 'pointer', border: 'none' }} title="Edit">⚙️</button>
                                            <button onClick={() => handleDelete(product.id)} style={{ background: 'none', fontSize: '18px', cursor: 'pointer', border: 'none' }} title="Delete">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Product Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card animate-fade-in" style={{
                        width: '100%',
                        maxWidth: '700px',
                        maxHeight: '85vh',
                        overflowY: 'auto',
                        padding: '3rem',
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '4px' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Define product attributes for your digital storefront</p>
                            </div>
                            <button onClick={handleModalClose} style={{ background: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-muted)', border: 'none' }}>×</button>
                        </div>

                        <form onSubmit={editingProduct ? handleUpdate : handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ gridColumn: '1 / -1' }} className="form-group">
                                    <label>Product Name</label>
                                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} style={inputStyles} placeholder="Premium Leather Jacket" />
                                </div>

                                <div className="form-group">
                                    <label>Base Price (₹)</label>
                                    <input type="number" name="price" required min="0" step="0.01" value={formData.price} onChange={handleInputChange} style={inputStyles} placeholder="4999" />
                                </div>

                                <div className="form-group">
                                    <label>Initial Stock</label>
                                    <input type="number" name="stock" required min="0" value={formData.stock} onChange={handleInputChange} style={inputStyles} placeholder="100" />
                                </div>

                                <div className="form-group">
                                    <label>Category</label>
                                    <select name="category" required value={formData.category} onChange={handleInputChange} style={inputStyles}>
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Sub Category</label>
                                    <select name="subcategory" value={formData.subcategory} onChange={handleInputChange} style={inputStyles} disabled={!formData.category}>
                                        <option value="">Select Sub-Category</option>
                                        {filteredSubcategories.map(sub => (
                                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Brand Name</label>
                                    <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} style={inputStyles} placeholder="Urban Style" />
                                </div>

                                <div className="form-group">
                                    <label>Promotional Discount (%)</label>
                                    <input type="number" name="discount_percentage" min="0" max="100" value={formData.discount_percentage} onChange={handleInputChange} style={inputStyles} />
                                </div>

                                <div style={{ gridColumn: '1 / -1' }} className="form-group">
                                    <label>Visual Protocol (Images)</label>
                                    <div style={{
                                        border: '2px dashed var(--border)',
                                        borderRadius: '12px',
                                        padding: '24px',
                                        textAlign: 'center',
                                        backgroundColor: '#fafbfc'
                                    }}>
                                        <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ opacity: 0, position: 'absolute', width: '1px' }} id="file-upload" />
                                        <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                                            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📸</div>
                                            <div style={{ fontWeight: '700', color: 'var(--primary)' }}>Upload Product Gallery</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Images selected: {images.length}</div>
                                        </label>
                                    </div>
                                </div>

                                <div style={{ gridColumn: '1 / -1' }} className="form-group">
                                    <label>Product Narrative (Description)</label>
                                    <textarea name="description" required rows="4" value={formData.description} onChange={handleInputChange} style={inputStyles} placeholder="Crafted with care and precision..." />
                                </div>
                            </div>

                            <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
                                <button type="button" onClick={handleModalClose} className="btn btn-outline" style={{ flex: 1, padding: '14px' }}>Discard</button>
                                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 2, padding: '14px' }}>
                                    {submitting ? (editingProduct ? 'Updating...' : 'Synthesizing...') : (editingProduct ? 'Update Product' : 'Finalize Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const inputStyles = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    fontSize: '14px',
    backgroundColor: '#fafbfc'
};


export default AdminProducts;
