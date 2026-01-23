import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('categories');

    // Modal States
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Form States
    const [categoryForm, setCategoryForm] = useState({ name: '', description: '', is_active: true });
    const [categoryImage, setCategoryImage] = useState(null);
    const [subcategoryForm, setSubcategoryForm] = useState({ name: '', description: '', category: '', is_active: true });

    useEffect(() => {
        fetchCategories();
        fetchSubcategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/admin/categories/');
            setCategories(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
            setLoading(false);
        }
    };

    const fetchSubcategories = async () => {
        try {
            const response = await api.get('/admin/subcategories/');
            setSubcategories(response.data);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };

    // Category CRUD
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', categoryForm.name);
            formData.append('description', categoryForm.description);
            formData.append('is_active', categoryForm.is_active);
            if (categoryImage) {
                formData.append('image', categoryImage);
            }

            if (editingItem) {
                await api.put(`/admin/categories/${editingItem.id}/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Category updated successfully! ✨');
            } else {
                await api.post('/admin/categories/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Category created successfully! 🎉');
            }
            setShowCategoryModal(false);
            setCategoryForm({ name: '', description: '', is_active: true });
            setCategoryImage(null);
            setEditingItem(null);
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error(error.response?.data?.error || 'Failed to save category');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await api.delete(`/admin/categories/${id}/`);
            toast.success('Category deleted successfully!');
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete category');
        }
    };

    const editCategory = (cat) => {
        setEditingItem(cat);
        setCategoryForm({ name: cat.name, description: cat.description || '', is_active: cat.is_active });
        setCategoryImage(null);
        setShowCategoryModal(true);
    };

    // SubCategory CRUD
    const handleSubcategorySubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingItem) {
                await api.put(`/admin/subcategories/${editingItem.id}/`, subcategoryForm);
                toast.success('SubCategory updated successfully! ✨');
            } else {
                await api.post('/admin/subcategories/', subcategoryForm);
                toast.success('SubCategory created successfully! 🎉');
            }
            setShowSubcategoryModal(false);
            setSubcategoryForm({ name: '', description: '', category: '', is_active: true });
            setEditingItem(null);
            fetchSubcategories();
        } catch (error) {
            console.error('Error saving subcategory:', error);
            toast.error(error.response?.data?.error || 'Failed to save subcategory');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteSubcategory = async (id) => {
        if (!window.confirm('Are you sure you want to delete this subcategory?')) return;
        try {
            await api.delete(`/admin/subcategories/${id}/`);
            toast.success('SubCategory deleted successfully!');
            fetchSubcategories();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete subcategory');
        }
    };

    const editSubcategory = (sub) => {
        setEditingItem(sub);
        setSubcategoryForm({ name: sub.name, description: sub.description || '', category: sub.category, is_active: sub.is_active });
        setShowSubcategoryModal(true);
    };

    const inputStyles = {
        width: '100%',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        fontSize: '14px',
        backgroundColor: '#fafbfc'
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
                        Manage your product categories and subcategories
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0', marginBottom: '2rem', borderBottom: '2px solid var(--border)' }}>
                <button
                    onClick={() => setActiveTab('categories')}
                    style={{
                        padding: '12px 24px',
                        background: 'none',
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        color: activeTab === 'categories' ? 'var(--primary)' : 'var(--text-muted)',
                        borderBottom: activeTab === 'categories' ? '2px solid var(--primary)' : '2px solid transparent',
                        marginBottom: '-2px',
                        transition: 'all 0.2s ease'
                    }}
                >
                    📁 Categories ({categories.length})
                </button>
                <button
                    onClick={() => setActiveTab('subcategories')}
                    style={{
                        padding: '12px 24px',
                        background: 'none',
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        color: activeTab === 'subcategories' ? 'var(--primary)' : 'var(--text-muted)',
                        borderBottom: activeTab === 'subcategories' ? '2px solid var(--primary)' : '2px solid transparent',
                        marginBottom: '-2px',
                        transition: 'all 0.2s ease'
                    }}
                >
                    📂 SubCategories ({subcategories.length})
                </button>
            </div>

            {/* Categories Tab */}
            {activeTab === 'categories' && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                        <button
                            onClick={() => { setEditingItem(null); setCategoryForm({ name: '', description: '', is_active: true }); setCategoryImage(null); setShowCategoryModal(true); }}
                            className="btn btn-primary"
                            style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}
                        >
                            <span style={{ fontSize: '18px' }}>➕</span> New Category
                        </button>
                    </div>

                    <div className="card" style={{ overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#fafbfc', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Category Name</th>
                                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Description</th>
                                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SubCategories</th>
                                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--primary)' }}>Loading...</td></tr>
                                ) : categories.length === 0 ? (
                                    <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No categories found. Create your first category!</td></tr>
                                ) : (
                                    categories.map((cat) => (
                                        <tr key={cat.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '40px', height: '40px', borderRadius: '10px',
                                                        background: cat.image ? 'transparent' : 'linear-gradient(135deg, var(--primary-light), var(--primary))',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: 'white', fontWeight: '800', fontSize: '16px',
                                                        overflow: 'hidden'
                                                    }}>
                                                        {cat.image ? (
                                                            <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            cat.name.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <span style={{ fontWeight: '700', color: 'var(--text)' }}>{cat.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                                {cat.description || '-'}
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span style={{
                                                    padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                                                    backgroundColor: cat.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: cat.is_active ? '#10b981' : '#ef4444'
                                                }}>
                                                    {cat.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 24px', fontWeight: '600' }}>
                                                {subcategories.filter(s => s.category === cat.id).length}
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button onClick={() => editCategory(cat)} style={{ background: 'none', fontSize: '18px', cursor: 'pointer' }}>✏️</button>
                                                    <button onClick={() => handleDeleteCategory(cat.id)} style={{ background: 'none', fontSize: '18px', cursor: 'pointer' }}>🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* SubCategories Tab */}
            {activeTab === 'subcategories' && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                        <button
                            onClick={() => { setEditingItem(null); setSubcategoryForm({ name: '', description: '', category: '', is_active: true }); setShowSubcategoryModal(true); }}
                            className="btn btn-primary"
                            style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}
                            disabled={categories.length === 0}
                        >
                            <span style={{ fontSize: '18px' }}>➕</span> New SubCategory
                        </button>
                    </div>

                    {categories.length === 0 && (
                        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Please create categories first before adding subcategories.
                        </div>
                    )}

                    {categories.length > 0 && (
                        <div className="card" style={{ overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#fafbfc', borderBottom: '1px solid var(--border)' }}>
                                        <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SubCategory</th>
                                        <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Parent Category</th>
                                        <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Description</th>
                                        <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                                        <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subcategories.length === 0 ? (
                                        <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No subcategories found.</td></tr>
                                    ) : (
                                        subcategories.map((sub) => (
                                            <tr key={sub.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                                <td style={{ padding: '16px 24px', fontWeight: '700', color: 'var(--text)' }}>{sub.name}</td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <span style={{
                                                        padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700',
                                                        backgroundColor: 'var(--primary-light)', color: 'var(--primary)'
                                                    }}>
                                                        {sub.category_name}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                                    {sub.description || '-'}
                                                </td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <span style={{
                                                        padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                                                        backgroundColor: sub.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                        color: sub.is_active ? '#10b981' : '#ef4444'
                                                    }}>
                                                        {sub.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <button onClick={() => editSubcategory(sub)} style={{ background: 'none', fontSize: '18px', cursor: 'pointer' }}>✏️</button>
                                                        <button onClick={() => handleDeleteSubcategory(sub.id)} style={{ background: 'none', fontSize: '18px', cursor: 'pointer' }}>🗑️</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* Category Modal */}
            {showCategoryModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                                {editingItem ? 'Edit Category' : 'Add New Category'}
                            </h2>
                            <button onClick={() => setShowCategoryModal(false)} style={{ background: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-muted)' }}>×</button>
                        </div>

                        <form onSubmit={handleCategorySubmit}>
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px' }}>Category Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={categoryForm.name}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                    style={inputStyles}
                                    placeholder="e.g., Electronics"
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px' }}>Description</label>
                                <textarea
                                    rows="3"
                                    value={categoryForm.description}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                    style={inputStyles}
                                    placeholder="Brief description of the category"
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px' }}>Category Image</label>
                                <div style={{
                                    border: '2px dashed var(--border)',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    textAlign: 'center',
                                    backgroundColor: '#fafbfc',
                                    cursor: 'pointer'
                                }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setCategoryImage(e.target.files[0])}
                                        style={{ display: 'none' }}
                                        id="category-image-upload"
                                    />
                                    <label htmlFor="category-image-upload" style={{ cursor: 'pointer', display: 'block' }}>
                                        {categoryImage ? (
                                            <div>
                                                <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
                                                <div style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '13px' }}>{categoryImage.name}</div>
                                            </div>
                                        ) : editingItem?.image ? (
                                            <div>
                                                <img src={editingItem.image} alt="Current" style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '8px', marginBottom: '8px' }} />
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Click to change image</div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🖼️</div>
                                                <div style={{ fontWeight: '600', color: 'var(--primary)' }}>Upload Category Image</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Click to select image</div>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={categoryForm.is_active}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.checked })}
                                    />
                                    <span style={{ fontWeight: '600', fontSize: '13px' }}>Active</span>
                                </label>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="button" onClick={() => setShowCategoryModal(false)} className="btn btn-outline" style={{ flex: 1, padding: '12px' }}>Cancel</button>
                                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 2, padding: '12px' }}>
                                    {submitting ? 'Saving...' : (editingItem ? 'Update Category' : 'Create Category')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* SubCategory Modal */}
            {showSubcategoryModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                                {editingItem ? 'Edit SubCategory' : 'Add New SubCategory'}
                            </h2>
                            <button onClick={() => setShowSubcategoryModal(false)} style={{ background: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-muted)' }}>×</button>
                        </div>

                        <form onSubmit={handleSubcategorySubmit}>
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px' }}>Parent Category *</label>
                                <select
                                    required
                                    value={subcategoryForm.category}
                                    onChange={(e) => setSubcategoryForm({ ...subcategoryForm, category: e.target.value })}
                                    style={inputStyles}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px' }}>SubCategory Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={subcategoryForm.name}
                                    onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
                                    style={inputStyles}
                                    placeholder="e.g., Smartphones"
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px' }}>Description</label>
                                <textarea
                                    rows="3"
                                    value={subcategoryForm.description}
                                    onChange={(e) => setSubcategoryForm({ ...subcategoryForm, description: e.target.value })}
                                    style={inputStyles}
                                    placeholder="Brief description"
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={subcategoryForm.is_active}
                                        onChange={(e) => setSubcategoryForm({ ...subcategoryForm, is_active: e.target.checked })}
                                    />
                                    <span style={{ fontWeight: '600', fontSize: '13px' }}>Active</span>
                                </label>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="button" onClick={() => setShowSubcategoryModal(false)} className="btn btn-outline" style={{ flex: 1, padding: '12px' }}>Cancel</button>
                                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 2, padding: '12px' }}>
                                    {submitting ? 'Saving...' : (editingItem ? 'Update SubCategory' : 'Create SubCategory')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
